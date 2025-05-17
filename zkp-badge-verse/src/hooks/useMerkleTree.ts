
import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { toast } from "@/hooks/use-toast";
import { generateMerkleTree, MerkleData } from '@/utils/generateMerkle';

interface UseMerkleTreeReturn {
  loading: boolean;
  parseCSV: (file: File) => Promise<void>;
  merkleData: MerkleData | null;
  reset: () => void;
}

export function useMerkleTree(): UseMerkleTreeReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [merkleData, setMerkleData] = useState<MerkleData | null>(null);

  const parseCSV = useCallback(async (file: File): Promise<void> => {
    setLoading(true);
    try {
      const result = await new Promise<string[]>((resolve, reject) => {
        Papa.parse<string[]>(file, {
          complete: (results) => {
            // Extract addresses from CSV data
            const addresses: string[] = [];
            
            results.data.forEach((row) => {
              if (row && row.length > 0 && typeof row[0] === 'string') {
                const address = row[0].trim();
                if (address && address !== '' && !address.startsWith('#')) {
                  addresses.push(address);
                }
              }
            });
            
            if (addresses.length === 0) {
              reject(new Error('No valid addresses found in CSV file'));
              return;
            }
            
            resolve(addresses);
          },
          error: (error) => {
            reject(error);
          }
        });
      });

      // Generate Merkle Tree from addresses
      const data = generateMerkleTree(result);
      setMerkleData(data);
      
      toast({
        title: "CSV processed successfully",
        description: `Generated Merkle tree with ${data.addressCount} unique addresses`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error processing CSV",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
      console.error("CSV processing error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setMerkleData(null);
  }, []);

  return {
    loading,
    parseCSV,
    merkleData,
    reset,
  };
}
