import { GoogleGenerativeAI } from "@google/generative-ai";

// Primary key from environment
const primaryKey = process.env.GEMINI_API_KEY;

// Backup key(s) - from environment variables for security
const backupKey = process.env.GEMINI_API_KEY_BACKUP;

// List of available keys
const validKeys = [primaryKey, backupKey].filter(key => key && key.length > 0) as string[];

if (validKeys.length === 0) {
  console.warn("No valid GEMINI_API_KEYS found.");
}

// Simple usage counter to rotate keys (round-robin)
let currentKeyIndex = 0;

export const getSmartGeminiClient = () => {
  if (validKeys.length === 0) return new GoogleGenerativeAI("");

  // Rotate to the next key
  const keyToUse = validKeys[currentKeyIndex];
  console.log(`Using API Key index: ${currentKeyIndex} (Total keys: ${validKeys.length})`);

  // Update index for next call
  currentKeyIndex = (currentKeyIndex + 1) % validKeys.length;

  return new GoogleGenerativeAI(keyToUse);
};

// Deprecated: kept for backward compatibility if needed, but routes should switch to getSmartGeminiClient
export const genAI = new GoogleGenerativeAI(primaryKey || backupKey || "");
