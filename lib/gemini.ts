import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Missing GEMINI_API_KEY in environment variables");
}

// Export the client so we can instantiate different models dynamically
export const genAI = new GoogleGenerativeAI(apiKey || "");
