import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt } from "./prompts";

export interface AnalysisResult {
  queryType?: "check" | "translate";
  isNatural: boolean;
  detectedLanguage: string;
  detectedRegion: string;
  correction: string;
  explanation: string;
  deepDive: string[];
}

if (!process.env.GEMINI_API_KEY) {
  console.warn("[NativeVibe] GEMINI_API_KEY is not set — analysis will fail.");
}

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function analyzePhrase(query: string, sourceLang = "English"): Promise<AnalysisResult> {
  const model = genai.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.3,
    },
    systemInstruction: buildSystemPrompt(sourceLang),
  });

  const result = await model.generateContent(query);
  const text = result.response.text().trim();

  // Strip any accidental markdown fences the model might add
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

  try {
    const parsed = JSON.parse(cleaned) as AnalysisResult;

    // Validate required fields
    if (typeof parsed.isNatural !== "boolean" || !parsed.correction || !parsed.explanation) {
      throw new Error("Incomplete response from model");
    }

    return parsed;
  } catch {
    throw new Error(`Failed to parse model response: ${text.slice(0, 200)}`);
  }
}
