
export type QRTypes = 'text' | 'url' | 'ethereum' | 'solana' | 'event' | 'custom';

interface ValidationResult {
  valid: boolean;
  message: string;
}

/**
 * Validates a URL string
 */
export const isValidUrl = (value: string): boolean => {
  try {
    // Check if it's a valid URL format
    const url = new URL(value);
    // Make sure it has http or https protocol
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validates an Ethereum address
 */
export const isValidEthereumAddress = (value: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
};

/**
 * Validates a Solana address
 */
export const isValidSolanaAddress = (value: string): boolean => {
  // Basic validation for Solana address format (base58 encoded, typically 32-44 chars)
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);
};

/**
 * Validates QR code value based on the selected type
 */
export const validateQRValue = (value: string, type: QRTypes): ValidationResult => {
  if (!value.trim()) {
    return { valid: false, message: 'Value cannot be empty' };
  }
  
  switch (type) {
    case 'url':
      if (!isValidUrl(value)) {
        return { 
          valid: false, 
          message: 'Please enter a valid URL (e.g., https://example.com)' 
        };
      }
      break;
      
    case 'ethereum':
      if (!isValidEthereumAddress(value)) {
        return { 
          valid: false, 
          message: 'Please enter a valid Ethereum address (0x followed by 40 hexadecimal characters)' 
        };
      }
      break;
      
    case 'solana':
      if (!isValidSolanaAddress(value)) {
        return { 
          valid: false, 
          message: 'Please enter a valid Solana address' 
        };
      }
      break;
      
    case 'event':
      if (value.length < 6) {
        return { 
          valid: false, 
          message: 'Event ID should be at least 6 characters long' 
        };
      }
      break;
      
    case 'text':
      if (value.length > 2000) {
        return { 
          valid: false, 
          message: 'Text is too long. Maximum 2000 characters allowed.' 
        };
      }
      break;
  }
  
  return { valid: true, message: '' };
};

/**
 * Helper to get file data URL
 */
export const getFileDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};
