import Anthropic from "@anthropic-ai/sdk";
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

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("[NativeFlow] ANTHROPIC_API_KEY is not set — analysis will fail.");
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function analyzePhrase(query: string, sourceLang = "English"): Promise<AnalysisResult> {
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: buildSystemPrompt(sourceLang),
    messages: [{ role: "user", content: query }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

  try {
    const parsed = JSON.parse(cleaned) as AnalysisResult;
    if (typeof parsed.isNatural !== "boolean" || !parsed.correction || !parsed.explanation) {
      throw new Error("Incomplete response from model");
    }
    return parsed;
  } catch {
    throw new Error(`Failed to parse model response: ${text.slice(0, 200)}`);
  }
}
