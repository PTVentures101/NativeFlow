import { anthropic, CLAUDE_MODEL, stripJsonFences } from "./anthropic";
import { buildSystemPrompt } from "./prompts";

export interface AnalysisResult {
  queryType?: "check" | "translate";
  isNatural: boolean;
  detectedLanguage: string;
  detectedRegion: string;
  correction: string;
  gloss?: string;
  explanation: string;
  deepDive: string[];
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("[NativeFlow] ANTHROPIC_API_KEY is not set — analysis will fail.");
}

export async function analyzePhrase(query: string, sourceLang = "English", location = ""): Promise<AnalysisResult> {
  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: buildSystemPrompt(sourceLang, location),
    messages: [{ role: "user", content: query }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";
  const cleaned = stripJsonFences(text);

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
