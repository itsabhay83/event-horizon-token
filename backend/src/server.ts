import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { IDL, ZkCpopProgram } from "../solana-program/zk_cpop_program/target/types/zk_cpop_program"; // Adjust path as needed
import bs58 from "bs58";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// Database setup (SQLite)
const db = new sqlite3.Database("./database/events.db", (err) => {
    if (err) {
        console.error("Error opening database", err.message);
    } else {
        console.log("Connected to the SQLite database.");
        db.run(`CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            event_id_onchain TEXT,
            creator_pubkey TEXT,
            merkle_tree_pubkey TEXT,
            collection_mint_pubkey TEXT,
            qr_code_data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS attendees (
            id TEXT PRIMARY KEY,
            event_id TEXT,
            attendee_pubkey TEXT,
            leaf_index INTEGER,
            claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (event_id) REFERENCES events (id)
        )`);
    }
});

// Solana connection and program setup
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
const connection = new Connection(SOLANA_RPC_URL, "confirmed");

// Load your program
const programId = new PublicKey(process.env.PROGRAM_ID || "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); // Replace with your deployed program ID

// Helper to get provider
const getProvider = (payerKeypair: Keypair) => {
    const provider = new AnchorProvider(
        connection,
        new web3.Wallet(payerKeypair),
        AnchorProvider.defaultOptions()
    );
    return provider;
};

// --- API Endpoints ---

// Endpoint to create a new event
app.post("/api/events", async (req: Request, res: Response) => {
    const { creator_secret_key, event_id_onchain, merkle_tree_pubkey, collection_mint_pubkey } = req.body;

    if (!creator_secret_key || !event_id_onchain || !merkle_tree_pubkey || !collection_mint_pubkey) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const creatorKeypair = Keypair.fromSecretKey(bs58.decode(creator_secret_key));
        const provider = getProvider(creatorKeypair);
        const program = new Program<ZkCpopProgram>(IDL, programId, provider);

        const [eventAccountPDA, _] = PublicKey.findProgramAddressSync(
            [Buffer.from("event"), Buffer.from(event_id_onchain)],
            program.programId
        );

        const tx = await program.methods
            .initializeEvent(event_id_onchain, new PublicKey(merkle_tree_pubkey), new PublicKey(collection_mint_pubkey))
            .accounts({
                eventAccount: eventAccountPDA,
                creator: creatorKeypair.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([creatorKeypair])
            .rpc();

        const event_record_id = uuidv4();
        const qr_code_data = JSON.stringify({ event_pda: eventAccountPDA.toBase58(), event_id: event_id_onchain }); // Simple QR data

        db.run(
            `INSERT INTO events (id, event_id_onchain, creator_pubkey, merkle_tree_pubkey, collection_mint_pubkey, qr_code_data) VALUES (?, ?, ?, ?, ?, ?)`, 
            [event_record_id, event_id_onchain, creatorKeypair.publicKey.toBase58(), merkle_tree_pubkey, collection_mint_pubkey, qr_code_data],
            function (err) {
                if (err) {
                    console.error("Error inserting event into DB", err.message);
                    return res.status(500).json({ error: "Failed to save event to database", details: err.message });
                }
                res.status(201).json({
                    message: "Event created and initialized on-chain successfully",
                    transactionSignature: tx,
                    eventPDA: eventAccountPDA.toBase58(),
                    eventIdDb: event_record_id,
                    qrCodeData: qr_code_data
                });
            }
        );
    } catch (error: any) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Failed to create event", details: error.message });
    }
});

// Endpoint for an attendee to claim a cToken
app.post("/api/claim", async (req: Request, res: Response) => {
    const { attendee_secret_key, event_pda, root, leaf_index, proof, leaf_bytes_hex } = req.body;

    if (!attendee_secret_key || !event_pda || !root || leaf_index === undefined || !proof || !leaf_bytes_hex) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const attendeeKeypair = Keypair.fromSecretKey(bs58.decode(attendee_secret_key));
        const provider = getProvider(attendeeKeypair);
        const program = new Program<ZkCpopProgram>(IDL, programId, provider);

        const eventAccountPDA = new PublicKey(event_pda);
        const eventAccountInfo = await program.account.eventAccount.fetch(eventAccountPDA);

        // Convert hex leaf_bytes to Vec<u8>
        const leafBytes = Buffer.from(leaf_bytes_hex, "hex");

        // Convert root and proof from hex strings to [u8; 32]
        const rootBytes = Buffer.from(root, "hex");
        if (rootBytes.length !== 32) {
            return res.status(400).json({ error: "Invalid root length. Must be 32 bytes (64 hex chars)." });
        }
        const merkleRoot: [number] = Array.from(rootBytes) as any; // Type assertion

        const merkleProof: Array<[number]> = proof.map((p: string) => {
            const proofElementBytes = Buffer.from(p, "hex");
            if (proofElementBytes.length !== 32) {
                throw new Error("Invalid proof element length. Each must be 32 bytes (64 hex chars).");
            }
            return Array.from(proofElementBytes);
        });

        const tx = await program.methods
            .claimCtoken(merkleRoot, leaf_index, merkleProof, Array.from(leafBytes))
            .accounts({
                eventAccount: eventAccountPDA,
                attendee: attendeeKeypair.publicKey,
                merkleTree: eventAccountInfo.merkleTreePubkey, // Assuming this is the Light Protocol tree account
                collectionMint: eventAccountInfo.collectionMint,
                treeAuthority: attendeeKeypair.publicKey, // Placeholder: This needs to be the actual Bubblegum tree authority
                tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // SPL Token Program
                systemProgram: SystemProgram.programId,
                lightProtocolProgram: new PublicKey("L1TEV1fUf4s1gH3qxdc2g1mS1gH3qxdc2g1mS1gH3qxd"), // Placeholder Light Protocol Program ID
            })
            .signers([attendeeKeypair])
            .rpc();

        const claim_record_id = uuidv4();
        db.run(
            `INSERT INTO attendees (id, event_id, attendee_pubkey, leaf_index) VALUES (?, (SELECT id FROM events WHERE event_id_onchain = ?), ?, ?)`, 
            [claim_record_id, eventAccountInfo.eventId, attendeeKeypair.publicKey.toBase58(), leaf_index],
            function (err) {
                if (err) {
                    console.error("Error inserting claim into DB", err.message);
                    // Don't fail the whole request if DB write fails, but log it
                }
            }
        );

        res.status(200).json({
            message: "cToken claimed successfully",
            transactionSignature: tx,
            claimIdDb: claim_record_id
        });
    } catch (error: any) {
        console.error("Error claiming cToken:", error);
        res.status(500).json({ error: "Failed to claim cToken", details: error.message });
    }
});

// Endpoint to get event details (including QR code data)
app.get("/api/events/:eventIdDb", (req: Request, res: Response) => {
    const { eventIdDb } = req.params;
    db.get("SELECT * FROM events WHERE id = ?", [eventIdDb], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.status(200).json(row);
    });
});

// Endpoint to get claimed tokens for an event
app.get("/api/events/:eventIdDb/claims", (req: Request, res: Response) => {
    const { eventIdDb } = req.params;
    db.all("SELECT attendee_pubkey, leaf_index, claimed_at FROM attendees WHERE event_id = ? ORDER BY claimed_at DESC", [eventIdDb], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

