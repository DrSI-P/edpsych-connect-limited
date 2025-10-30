// src/utils/encryption.ts
import CryptoJS from 'crypto-js';

// Encryption key should be stored securely and not in client-side code
// For production, this should come from environment variables or a secure backend
const getEncryptionKey = (): string => {
  // In production, this would be retrieved securely
  return process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-dev-key-change-in-production';
};

/**
 * Encrypts data using AES encryption
 * @param data - Data to encrypt
 * @param key - Optional encryption key (uses default if not provided)
 * @returns Encrypted string
 */
export const encrypt = (data: string, key?: string): string => {
  const encryptionKey = key || getEncryptionKey();
  return CryptoJS.AES.encrypt(data, encryptionKey).toString();
};

/**
 * Decrypts AES encrypted data
 * @param encryptedData - Data to decrypt
 * @param key - Optional encryption key (uses default if not provided)
 * @returns Decrypted string or null if decryption fails
 */
export const decrypt = (encryptedData: string, key?: string): string | null => {
  try {
    const encryptionKey = key || getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

/**
 * Securely stores data in browser storage with encryption
 * @param key - Storage key
 * @param data - Data to store
 * @param useSession - Whether to use sessionStorage instead of localStorage
 */
export const secureStore = (key: string, data: any, useSession = false): void => {
  const storage = useSession ? sessionStorage : localStorage;
  const serialized = typeof data === 'string' ? data : JSON.stringify(data);
  const encrypted = encrypt(serialized);
  storage.setItem(key, encrypted);
};

/**
 * Retrieves and decrypts data from browser storage
 * @param key - Storage key
 * @param useSession - Whether to use sessionStorage instead of localStorage
 * @returns Decrypted data or null if not found or decryption fails
 */
export const secureRetrieve = (key: string, useSession = false): any => {
  const storage = useSession ? sessionStorage : localStorage;
  const encrypted = storage.getItem(key);

  if (!encrypted) return null;

  const decrypted = decrypt(encrypted);
  if (!decrypted) return null;

  try {
    return JSON.parse(decrypted);
  } catch {
    // If not valid JSON, return as string
    return decrypted;
  }
};

/**
 * Securely removes data from browser storage
 * @param key - Storage key
 * @param useSession - Whether to use sessionStorage instead of localStorage
 */
export const secureRemove = (key: string, useSession = false): void => {
  const storage = useSession ? sessionStorage : localStorage;
  storage.removeItem(key);
};

/**
 * Validates if data can be securely stored
 * @param data - Data to validate
 * @returns True if data is safe to store
 */
export const isValidForStorage = (data: any): boolean => {
  try {
    JSON.stringify(data);
    return true;
  } catch {
    return false;
  }
};