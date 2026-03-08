import { GoogleGenerativeAI } from "@google/generative-ai";

export interface PhraseSuggestion {
  phrase: string;
  gloss: string;
  note: string;
}

export interface PhrasesResult {
  situation: string;
  phrases: PhraseSuggestion[];
}

function buildPhrasesSystemPrompt(sourceLang = "English"): string {
  const langInstruction = sourceLang !== "English"
    ? `\nOUTPUT LANGUAGE: Write the "situation", "gloss", and "note" fields in ${sourceLang}. The "phrase" field must always remain in the target language being analysed.\n`
    : "";

  return `You are NativeVibe's phrase coach — a regional language expert who gives learners the exact phrases they need for a specific real-world situation.${langInstruction}

Given a language learning query and its detected context, identify the situation and return 4–5 highly practical, authentic phrases for that exact scenario.

RESPOND ONLY with a single valid JSON object. No markdown fences. No explanation outside the JSON.

{
  "situation": string,
  "phrases": [
    { "phrase": string, "gloss": string, "note": string }
  ]
}

FIELD RULES:
- situation: 3–6 words describing the scenario (e.g. "Ordering drinks at a bar", "Asking for directions", "Haggling at a market")
- phrase: the authentic local phrase in the target language — natural, regionalized, same register as the original query
- gloss: concise translation in the output language, 3–8 words
- note: ONE sharp insight, max 10 words — regional specificity, register tip, or usage warning

QUALITY BAR:
- Phrases must be directly useful in the same moment/scenario as the original query
- Match the register — if the query is casual, all phrases should be casual
- Prefer phrases a textbook would never teach: contractions, colloquial shortcuts, local idioms
- No generic filler phrases (no "hello", "how are you", "thank you" unless they are genuinely scenario-relevant)
- Each phrase should be distinct and cover a different micro-moment in the scenario`;
}

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function getSituationalPhrases(
  originalQuery: string,
  detectedLanguage: string,
  detectedRegion: string,
  correction: string,
  sourceLang = "English"
): Promise<PhrasesResult> {
  const model = genai.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.4,
    },
    systemInstruction: buildPhrasesSystemPrompt(sourceLang),
  });

  const prompt = `Original query: "${originalQuery}"
Authentic local correction: "${correction}"
Detected language: ${detectedLanguage}
Detected region: ${detectedRegion}

IMPORTANT: Base all phrases on the vocabulary and phrasing from the "Authentic local correction", not the original query. If the correction replaces a word (e.g. 'tapas' instead of 'pintxos' in this region), all phrases must use the corrected local vocabulary.

Do NOT include the "Authentic local correction" phrase itself as one of the suggestions — the user already has that. Provide only additional, complementary phrases for the same scenario.

Provide situational phrases for this scenario.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

  const parsed = JSON.parse(cleaned) as PhrasesResult;

  if (!parsed.situation || !Array.isArray(parsed.phrases) || parsed.phrases.length === 0) {
    throw new Error("Invalid phrases response from model");
  }

  return parsed;
}
