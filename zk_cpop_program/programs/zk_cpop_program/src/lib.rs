use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use light_protocol_program::program::LightProtocolProgram;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); // Replace with your program ID after deployment

#[program]
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
pub struct InitializeEvent<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + (4 + event_id.len()) + 32 + 32 + (4 + MAX_ATTENDEES as usize * 4) + 32, // Discriminator, creator, event_id, merkle_tree, collection_mint, claimed_leaves_vec, authority
        seeds = [b"event".as_ref(), event_id.as_ref()],
        bump
    )]
    pub event_account: Account<'info, EventAccount>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimCToken<'info> {
    #[account(mut, seeds = [b"event".as_ref(), event_account.event_id.as_ref()], bump)] // Ensure event_id is accessible for seed
    pub event_account: Account<'info, EventAccount>,
    #[account(mut)] // Attendee is the one claiming and receiving the cNFT
    pub attendee: Signer<'info>,
    /// CHECK: This is the Merkle tree account used by Light Protocol. Verification happens via CPI.
    pub merkle_tree: AccountInfo<'info>, // This would be the Light Protocol Merkle Tree account
    /// CHECK: This is the cNFT collection mint. Minting happens via CPI to Bubblegum.
    pub collection_mint: AccountInfo<'info>,
    /// CHECK: This is the tree authority for the Bubblegum cNFT collection.
    pub tree_authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    // Required for CPI to Light Protocol for proof verification
    pub light_protocol_program: Program<'info, LightProtocolProgram>,
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
// fn cpi_to_bubblegum_mint_cnft<'info>(
//     collection_mint: AccountInfo<'info>,
//     recipient: AccountInfo<'info>,
//     tree_authority: AccountInfo<'info>,
//     merkle_tree: AccountInfo<'info>,
//     leaf: &[u8],
//     token_program: AccountInfo<'info>,
//     system_program: AccountInfo<'info>,
//     // ... other accounts and signers
// ) -> Result<()> {
//     // Construct and invoke the CPI to Bubblegum program
//     Ok(())
// }

