
declare module 'merkletreejs' {
  export class MerkleTree {
    constructor(leaves: Buffer[], hashFunction: Function, options?: { sortPairs?: boolean });
    getHexRoot(): string;
    getRoot(): Buffer;
    getHexProof(leaf: Buffer): string[];
    getProof(leaf: Buffer): { position: 'right' | 'left', data: Buffer }[];
    verify(proof: string[], leaf: Buffer, root: Buffer): boolean;
  }
}

declare module 'keccak256' {
  export default function keccak256(data: string | Buffer): Buffer;
}
