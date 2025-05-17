
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

export type MerkleData = {
  merkleRoot: string;
  merkleTree: MerkleTree;
  leaves: Buffer[];
  addressCount: number;
};

export function generateMerkleTree(addresses: string[]): MerkleData {
  // Filter out empty addresses and remove duplicates
  const uniqueAddresses = [...new Set(addresses.filter(address => address.trim() !== ''))];
  
  // Hash all addresses using keccak256
  const leaves = uniqueAddresses.map(address => keccak256(address));
  
  // Create a new Merkle Tree using the hashed addresses
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  
  // Get the Merkle Root as a hex string
  const merkleRoot = merkleTree.getHexRoot();
  
  return {
    merkleRoot,
    merkleTree,
    leaves,
    addressCount: uniqueAddresses.length,
  };
}

export function generateMerkleProof(merkleTree: MerkleTree, address: string): string[] {
  const leaf = keccak256(address);
  const proof = merkleTree.getHexProof(leaf);
  return proof;
}

export function verifyMerkleProof(
  merkleTree: MerkleTree,
  address: string,
  proof: string[]
): boolean {
  const leaf = keccak256(address);
  return merkleTree.verify(proof, leaf, merkleTree.getRoot());
}
