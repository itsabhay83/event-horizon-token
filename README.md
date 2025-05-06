# ZK cPOP Interface - Backend and Solana Program Setup

This document provides instructions for setting up and running the backend server and the Solana smart contract for the ZK cPOP Interface project.

## Project Structure

- `/backend`: Contains the Node.js/Express.js backend server code.
- `/solana-program`: Contains the Anchor-based Solana program code.

## Prerequisites

**For Backend:**
- Node.js (v18 or later recommended)
- npm or yarn

**For Solana Program:**
- Rust (latest stable, installed via rustup)
- Solana CLI (v1.18.x recommended, installed from Anza releases)
- Anchor Version Manager (AVM) and Anchor CLI (v0.29.0 was used for compatibility)

## Solana Program Setup & Build

1.  **Navigate to the Solana program directory:**
    ```bash
    cd zk-cpop-interface/solana-program/zk_cpop_program
    ```

2.  **Ensure Anchor v0.29.0 is active:**
    If you installed Anchor via AVM:
    ```bash
    source "$HOME/.cargo/env"
    export PATH="/home/ubuntu/.local/share/solana/install/active_release/bin:$PATH" # Adjust if your Solana install path differs
    export PATH="/home/ubuntu/.avm/bin:$PATH" # Adjust if your AVM path differs
    avm use 0.29.0
    anchor --version # Should output anchor-cli 0.29.0
    ```

3.  **Build the Solana Program:**
    **Build Status:** The build process for the Solana program (using `anchor build`) was encountering an issue where it was trying to invoke `build-bpf` which is not the correct command for Anchor 0.29.0. The error message was: `error: no such command: uild-bpf
pub mod zk_cpop_program {
    use super::*;    

    // Define the maximum number of attendees for an event
    const MAX_ATTENDEES: u16 = 1000;

    pub fn initialize_event(
        ctx: Context<InitializeEvent>,
        event_id: String,
        merkle_tree_pubkey: Pubkey, // Pubkey of the pre-initialized Merkle Tree by the creator
        collection_mint: Pubkey // Pubkey of the cNFT collection mint
    ) -> Result<()> {
        let event_account = &mut ctx.accounts.event_account;
        event_account.creator = *ctx.accounts.creator.key;
        event_account.event_id = event_id;
        event_account.merkle_tree_pubkey = merkle_tree_pubkey;
        event_account.collection_mint = collection_mint;
        event_account.claimed_leaf_indices = Vec::new();
        event_account.authority = *ctx.accounts.creator.key; // Or a PDA

        // Log event creation
        msg!("Event initialized: {}", event_account.event_id);
        msg!("Creator: {}", event_account.creator);
        msg!("Merkle Tree: {}", event_account.merkle_tree_pubkey);
        msg!("Collection Mint: {}", event_account.collection_mint);
        Ok(())
    }

    pub fn claim_ctoken(
        ctx: Context<ClaimCToken>,
        root: [u8; 32],
        leaf_index: u32,
        proof: Vec<[u8; 32]>,
        leaf_bytes: Vec<u8> // The attendee's public key as bytes, which forms the leaf
    ) -> Result<()> {
        let event_account = &mut ctx.accounts.event_account;
        let attendee = &ctx.accounts.attendee;

        // 1. Verify leaf_index is not already claimed
        if event_account.claimed_leaf_indices.contains(&leaf_index) {
            return err!(ErrorCode::TokenAlreadyClaimed);
        }

        // 2. Verify the attendee's public key matches the leaf_bytes
        let attendee_key_bytes = attendee.key().to_bytes();
        if attendee_key_bytes[..] != leaf_bytes[..] {
            return err!(ErrorCode::InvalidLeaf);
        }

        // 3. Verify Merkle proof using Light Protocol CPI (or directly if simpler for hackathon)
        // For hackathon simplicity, we might simulate this or use a simplified on-chain verification if possible.
        // Actual Light Protocol integration would involve CPI to their program.
        // For now, let's assume a helper function `verify_merkle_proof` exists or is part of Light Protocol CPI.
        
        // Placeholder for Merkle proof verification - in a real scenario, this would be a CPI
        // to Light Protocol or a direct on-chain verification if the tree is small enough or
        // a verifier program is available.
        let is_valid_proof = light_protocol_program::utils::verify_merkle_proof(
            root,
            &leaf_bytes, // Leaf is the attendee's pubkey bytes
            leaf_index.into(),
            proof,
            event_account.merkle_tree_pubkey // This would be the tree_id or similar identifier for Light Protocol
        );

        if !is_valid_proof {
            return err!(ErrorCode::InvalidMerkleProof);
        }

        // 4. Mint the cToken (NFT) to the attendee
        // This step assumes the `collection_mint` is a cNFT collection managed by a cNFT authority (e.g., Metaplex Bubblegum)
        // Minting a cNFT typically involves a CPI to the Bubblegum program.
        // For a hackathon, a simplified minting or transfer of a pre-minted token might be used if cNFT minting is too complex.
        // Here, we'll represent the concept. Actual cNFT minting requires CPI to Metaplex Bubblegum.
        // This is a conceptual representation. Actual cNFT minting is more involved.
        msg!("Merkle proof verified for attendee: {}. Leaf index: {}", attendee.key(), leaf_index);
        msg!("Minting cToken from collection {} to attendee {}", event_account.collection_mint, attendee.key());

        // Simulate cNFT minting via CPI to Bubblegum (this is a placeholder)
        // cpi_to_bubblegum_mint_cnft(
        //     ctx.accounts.collection_mint.to_account_info(),
        //     ctx.accounts.attendee.to_account_info(),
        //     ctx.accounts.tree_authority.to_account_info(), // Bubblegum tree authority
        //     ctx.accounts.merkle_tree.to_account_info(), // Bubblegum merkle tree
        //     &leaf_bytes, // leaf for the cNFT
        //     ctx.accounts.token_program.to_account_info(),
        //     ctx.accounts.system_program.to_account_info(),
        //     // ... other necessary accounts and signers
        // )?;

        // 5. Mark leaf_index as claimed
        event_account.claimed_leaf_indices.push(leaf_index);
        if event_account.claimed_leaf_indices.len() > MAX_ATTENDEES as usize {
            // This check is more of a safeguard, actual limit is Merkle tree size
            return err!(ErrorCode::MaxAttendeesReached);
        }

        msg!("cToken claimed successfully by attendee: {} for event: {}", attendee.key(), event_account.event_id);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(event_id: String)]
pub struct InitializeEvent<
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + (4 + event_id.len()) + 32 + 32 + (4 + MAX_ATTENDEES as usize * 4) + 32, // Discriminator, creator, event_id, merkle_tree, collection_mint, claimed_leaves_vec, authority
        seeds = [b"event".as_ref(), event_id.as_ref()],
        bump
    )]
    pub event_account: Account<
    #[account(mut)]
    pub creator: Signer<
    pub system_program: Program<
}

#[derive(Accounts)]
pub struct ClaimCToken<
    #[account(mut, seeds = [b"event".as_ref(), event_account.event_id.as_ref()], bump)] // Ensure event_id is accessible for seed
    pub event_account: Account<
    #[account(mut)] // Attendee is the one claiming and receiving the cNFT
    pub attendee: Signer<
    /// CHECK: This is the Merkle tree account used by Light Protocol. Verification happens via CPI.
    pub merkle_tree: AccountInfo<
    /// CHECK: This is the cNFT collection mint. Minting happens via CPI to Bubblegum.
    pub collection_mint: AccountInfo<
    /// CHECK: This is the tree authority for the Bubblegum cNFT collection.
    pub tree_authority: AccountInfo<
    pub token_program: Program<
    pub system_program: Program<
    // Required for CPI to Light Protocol for proof verification
    pub light_protocol_program: Program<
    // Add other accounts required for cNFT minting via Bubblegum CPI if implementing fully
}

#[account]
#[derive(Default)]
pub struct EventAccount {
    pub creator: Pubkey,
    pub event_id: String,
    pub merkle_tree_pubkey: Pubkey, // Pubkey of the Merkle Tree (managed by Light Protocol)
    pub collection_mint: Pubkey,    // Pubkey of the cNFT Collection Mint
    pub claimed_leaf_indices: Vec<u32>, // Stores indices of claimed leaves
    pub authority: Pubkey, // Authority to manage the event (e.g., update, close)
}

#[error_code]
pub enum ErrorCode {
    #[msg("This token has already been claimed.")]
    TokenAlreadyClaimed,
    #[msg("Invalid Merkle proof.")]
    InvalidMerkleProof,
    #[msg("The provided leaf data does not match the attendee.")]
    InvalidLeaf,
    #[msg("The event has reached its maximum number of attendees.")]
    MaxAttendeesReached,
    #[msg("Invalid Merkle Tree provided for the event.")]
    InvalidMerkleTree,
}

// Placeholder for CPI to Bubblegum for cNFT minting - this is complex and out of scope for a simple example
// fn cpi_to_bubblegum_mint_cnft<
//     collection_mint: AccountInfo<
//     recipient: AccountInfo<
//     tree_authority: AccountInfo<
//     merkle_tree: AccountInfo<
//     leaf: &[u8],
//     token_program: AccountInfo<
//     system_program: AccountInfo<
//     // ... other accounts and signers
// ) -> Result<()> {
//     // Construct and invoke the CPI to Bubblegum program
//     Ok(())
// }
`.
    You might need to consult the Anchor 0.29.0 documentation or adjust the `Anchor.toml` (specifically the `[provider]` or build script sections if they exist and are misconfigured) to ensure the correct Solana SBF build tools are invoked.
    The command should typically be:
    ```bash
    anchor build
    ```
    If successful, this will generate the program binary and IDL in the `target/` directory.

4.  **Deploy the Program (if built successfully):**
    ```bash
    anchor deploy
    ```
    Note the Program ID after deployment and update it in `solana-program/zk_cpop_program/programs/zk_cpop_program/src/lib.rs` and in the backend's `.env` file.

## Backend Server Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd zk-cpop-interface/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Create a `.env` file:**
    Copy the `.env.example` to `.env` and fill in the required values:
    ```bash
    cp .env.example .env
    ```
    Edit `.env` with your Solana RPC URL, the deployed Program ID, and any other necessary configurations.

4.  **Create the database directory:**
    ```bash
    mkdir -p database
    ```
    The SQLite database `events.db` will be created inside this directory when the server starts.

5.  **Compile TypeScript (if not using a watcher like ts-node-dev):**
    ```bash
    npm run build
    ```

6.  **Run the server:**
    For development (with auto-reload using ts-node-dev, if configured in `package.json`):
    ```bash
    npm run dev 
    # or yarn dev (if script is named 'dev')
    ```
    For production (after building):
    ```bash
    npm start 
    # or yarn start (if script is named 'start' and points to dist/server.js)
    ```
    The server should start, typically on `http://localhost:3001` (or the port specified in your `.env`).

## Backend API Endpoints

-   `POST /api/events`: Create a new event. 
    -   Body: `{ "creator_secret_key": "...", "event_id_onchain": "...", "merkle_tree_pubkey": "...", "collection_mint_pubkey": "..." }`
-   `POST /api/claim`: Claim a cToken for an event.
    -   Body: `{ "attendee_secret_key": "...", "event_pda": "...", "root": "[hex_string]", "leaf_index": number, "proof": ["[hex_string]", ...], "leaf_bytes_hex": "hex_string" }`
-   `GET /api/events/:eventIdDb`: Get event details by its database ID.
-   `GET /api/events/:eventIdDb/claims`: Get claimed tokens for an event by its database ID.

## Important Notes

-   **Light Protocol & Bubblegum:** The Solana program includes conceptual CPI calls to Light Protocol for Merkle proof verification and Metaplex Bubblegum for cNFT minting. These are placeholders. Full integration requires the actual Light Protocol and Bubblegum program IDs and their specific CPI interfaces.
-   **Tree Authority for Bubblegum:** The `tree_authority` in the `claim_ctoken` instruction is a placeholder. This needs to be the actual authority for the cNFT collection's Merkle tree when using Bubblegum.
-   **Error Handling:** Basic error handling is in place. Robust production systems would require more comprehensive error management and logging.
-   **Security:** The provided secret keys in API calls are for hackathon demonstration purposes. In a production environment, wallet adapters on the frontend would handle transaction signing securely without exposing secret keys.

