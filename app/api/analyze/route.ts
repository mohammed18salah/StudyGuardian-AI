import { NextRequest, NextResponse } from "next/server";
import { genAI } from "@/lib/gemini";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Configure maximum duration for the API route
export const maxDuration = 60;

const PROMPT_INSTRUCTIONS = `
You are an AI study assistant.
Analyze the provided lecture content.
Generate:
1. A concise summary
2. 5 exam-style questions
3. A simplified explanation
4. A 3-day study plan

Format the response in clear labeled sections.
RETURN THE RESPONSE AS A VALID JSON OBJECT ONLY.
Structure your JSON like this:
{
  "summary": "markdown string",
  "examQuestions": ["string", "string", ...],
  "explanation": "markdown string",
  "studyPlan": "markdown string"
}
`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const textContext = formData.get("text") as string | null;

    if (!file && !textContext) {
      return NextResponse.json(
        { error: "Please provide either a file or text content." },
        { status: 400 }
      );
    }

    let inputPart;
    let textContent = "";

    // Handle File Upload - Pass raw data to Gemini
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const mimeType = file.type; // e.g. "application/pdf" or "image/png"

      // Safety check for supported types
      if (mimeType !== "application/pdf" && !mimeType.startsWith("image/")) {
        return NextResponse.json(
          { error: "Unsupported file type. Please upload a PDF or Image." },
          { status: 400 }
        );
      }

      inputPart = {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: mimeType,
        },
      };
    } else if (textContext) {
      textContent = textContext;
    }

    // Construct the parts for Gemini
    const parts: any[] = [{ text: PROMPT_INSTRUCTIONS }];

    if (inputPart) {
      parts.push(inputPart);
    } else if (textContent) {
      parts.push({ text: `\n\n[CONTENT TO ANALYZE]:\n${textContent}` });
    }

    // Smart Model Selection: Use 'gemini-pro' (stable v1.0) as it is universally available
    const modelsToTry = ["gemini-pro"];

    let result;
    let usedModel = "";
    let primaryError;

    console.log("Starting Analysis...");

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting analysis with model: ${modelName}`);

        // Get the specific model instance
        const modelInstance = genAI.getGenerativeModel({
          model: modelName,
          // Safety settings to prevent blocking academic content
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ]
        });

        const currentResult = await modelInstance.generateContent({
          contents: [{ role: "user", parts }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7, // Balanced creativity
          }
        });

        // If we get here, it worked
        result = currentResult;
        usedModel = modelName;
        console.log(`Success! Connected to: ${modelName}`);
        break; // Exit loop on success

      } catch (error: any) {
        console.error(`Failed with ${modelName}:`, error.message);
        if (!primaryError) primaryError = error; // Capture the first error as it's likely the most relevant
      }
    }

    if (!result) {
      console.error("Analysis failed.");
      throw primaryError || new Error("AI model failed to respond.");
    }

    const response = result.response;
    const text = response.text();

    // Parse JSON
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(text);
      // Inject meta-data about which model was used
      jsonResponse.usedModel = usedModel;
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", text);
      return NextResponse.json(
        { error: "AI response was not in valid JSON format." },
        { status: 500 }
      );
    }

    return NextResponse.json(jsonResponse);

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500 }
    );
  }
}
