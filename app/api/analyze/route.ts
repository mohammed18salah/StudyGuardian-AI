import { NextRequest, NextResponse } from "next/server";
import { genAI } from "@/lib/gemini";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Configure maximum duration for the API route
export const maxDuration = 60;

const PROMPT_INSTRUCTIONS = (language: string = "english") => `
ROLE: You are an efficient academic tutor. Your goal is to provide a QUICK, HIGH-IMPACT study summary.

TASK: Analyze the lecture content and output a CONCISE study guide.

LANGUAGE: ${language === "arabic" ? "Arabic (العربية)" : "English"}.

CONSTRAINTS:
- Keep the summary UNDER 300 words. Focus ONLY on the main ideas.
- Keep the explanation UNDER 150 words.
- Be direct and to the point. Speed is key.

OUTPUT FORMAT: Return ONLY a raw JSON object.
JSON Structure:
{
  "summary": "Concise markdown string. Use bullet points for speed reading. Max 300 words.",
  "examQuestions": [
    "Question 1 (Direct & Clear)",
    "Question 2",
    "Question 3",
    "Question 4",
    "Question 5"
  ],
  "explanation": "Brief, simple info using the 'Feynman Technique'. Max 150 words.",
  "studyPlan": "Short, actionable 3-day checklist (Markdown)."
}
`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const textContext = formData.get("text") as string | null;
    const language = formData.get("language") as string || "english";

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
    const parts: any[] = [{ text: PROMPT_INSTRUCTIONS(language) }];

    if (inputPart) {
      parts.push(inputPart);
    } else if (textContent) {
      parts.push({ text: `\n\n[CONTENT TO ANALYZE]:\n${textContent}` });
    }

    // Smart Model Selection: Use 'gemini-2.5-flash' as confirmed available by user API check
    const modelsToTry = ["gemini-2.5-flash"];

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
