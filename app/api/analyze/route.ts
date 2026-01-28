import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import pdf from "pdf-parse";

// Configure maximum duration for the API route (mostly for Vercel)
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

    // Handle File Upload
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (file.type === "application/pdf") {
        try {
          const pdfData = await pdf(buffer);
          textContent = pdfData.text;
          // Prompt for Text Analysis (from PDF)
        } catch (error) {
           console.error("PDF Parse Error:", error);
           return NextResponse.json(
             { error: "Failed to parse PDF file." },
             { status: 500 }
           );
        }
      } else if (file.type.startsWith("image/")) {
        // Image Processing
        inputPart = {
          inlineData: {
            data: buffer.toString("base64"),
            mimeType: file.type,
          },
        };
      } else {
        return NextResponse.json(
          { error: "Unsupported file type. Please upload a PDF or Image." },
          { status: 400 }
        );
      }
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

    // Generate content
    // We explicitly ask for JSON in the prompt, but also can send generationConfig
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const response = result.response;
    const text = response.text();
    
    // Parse JSON
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", text);
      return NextResponse.json(
        { error: "AI response was not in valid JSON format." },
        { status: 500 }
      );
    }

    return NextResponse.json(jsonResponse);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
