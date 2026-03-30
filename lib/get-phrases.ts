import { anthropic, CLAUDE_MODEL, stripJsonFences } from "./anthropic";

export interface SituationalPhrase {
  phrase: string;
  gloss: string;
  note: string;
  category: string;
}

function buildSituationPhrasesPrompt(sourceLang = "English"): string {
  const langInstruction =
    sourceLang !== "English"
      ? `\nOUTPUT LANGUAGE: Write the "gloss", "note", and "category" fields in ${sourceLang}. The "phrase" field must always remain in the target language.\n`
      : "";

  return `You are NativeFlow's phrase coach — a regional language expert who teaches learners the exact phrases a local would actually say in any real-world situation.${langInstruction}
Given a situation described in plain language, a target language, and optionally a specific region, return 10 highly practical, genuinely colloquial phrases that a local would use in that scenario.

RESPOND ONLY with a valid JSON array. No markdown fences. No explanation outside the JSON.

[
  { "phrase": string, "gloss": string, "note": string, "category": string }
]

FIELD RULES:
- phrase: the authentic local phrase in the target language — natural, regionalized, colloquial
- gloss: natural translation in the output language, 3–8 words
- note: ONE sharp insight, max 10 words — register tip, regional variance, or usage warning. Empty string if nothing useful to add.
- category: short use-case label, 1–3 words (e.g. "Ordering", "Getting attention", "Paying up", "Calling the waiter", "Leaving", "Small talk")

QUALITY BAR:
- Phrases must be genuinely useful in the described situation — what a local would actually say
- Prefer phrases a textbook would never teach: contractions, colloquial shortcuts, local idioms
- Each phrase should cover a different micro-moment in the scenario
- Match the register implied by the situation (casual bar = casual phrases; formal meeting = formal)
- No generic filler phrases unless genuinely scenario-relevant
- Banned words in notes/gloss: "vibrant", "authentic", "essence", "nuanced", "rich", "energy", "pure"
- Avoid em dashes (—). Use commas or short sentences instead.`;
}

export async function getSituationPhrases(
  situation: string,
  targetLanguage: string,
  location: string,
  sourceLang = "English",
  excludePhrases: string[] = []
): Promise<SituationalPhrase[]> {
  const locationNote = location ? ` (specifically in ${location})` : "";
  const excludeNote = excludePhrases.length > 0
    ? `\n\nDo NOT repeat any of these phrases already provided:\n${excludePhrases.map(p => `- ${p}`).join("\n")}`
    : "";
  const userPrompt = `Situation: ${situation}
Target language: ${targetLanguage}${locationNote}

Provide 10 phrases a local would genuinely say in this situation.${excludeNote}`;

  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    system: buildSituationPhrasesPrompt(sourceLang),
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";
  const cleaned = stripJsonFences(text);

  try {
    const parsed = JSON.parse(cleaned) as SituationalPhrase[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Expected a non-empty JSON array");
    }
    return parsed.map((p) => ({
      phrase: String(p.phrase ?? ""),
      gloss: String(p.gloss ?? ""),
      note: String(p.note ?? ""),
      category: String(p.category ?? ""),
    }));
  } catch {
    throw new Error(`Failed to parse response: ${text.slice(0, 200)}`);
  }
}
