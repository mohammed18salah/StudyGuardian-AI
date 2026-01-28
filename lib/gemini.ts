import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("Missing GEMINI_API_KEY in environment variables");
}

export const genAI = new GoogleGenerativeAI(apiKey || "");

export const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});
