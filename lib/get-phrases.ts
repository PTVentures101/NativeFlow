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
Given a situation described in plain language and a language/location context, return 10 highly practical, genuinely colloquial phrases that a local would use in that scenario. The language/location context may be: a language only ("Japanese"), a location only ("Paris"), a combined form ("Spanish in Málaga"), or "not specified". When only a location is given, infer and use the dominant local language. When not specified, infer the most natural language from the situation itself.

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
- Default to polite, natural everyday language — courteous but not stiff
- Slang and casual shortcuts only when the situation explicitly calls for it (e.g. casual pub with close friends)
- Each phrase should cover a different micro-moment in the scenario
- When in doubt, err on the side of polite — a learner being too formal is fine; being rude is not
- No generic filler phrases unless genuinely scenario-relevant

LANGUAGE STYLE:
- Write phrases and notes as a human expert, not an AI assistant
- No em dashes (—). Use commas or short sentences instead.
- Banned words everywhere: "vibrant", "authentic", "essence", "nuanced", "rich", "energy", "pure", "delve", "straightforward", "seamlessly", "leverage", "robust", "elevate", "foster", "utilize"
- Notes must read like a tip from a friend, not a textbook caption
- Avoid overly poetic or unusual phrasing — clarity over flair`;
}

export async function getSituationPhrases(
  situation: string,
  languageContext: string,
  sourceLang = "English",
  excludePhrases: string[] = []
): Promise<SituationalPhrase[]> {
  const languageContextLine = languageContext
    ? `Language / location context: ${languageContext}`
    : `Language / location context: not specified — infer the language from the situation`;
  const excludeNote = excludePhrases.length > 0
    ? `\n\nDo NOT repeat any of these phrases already provided:\n${excludePhrases.map(p => `- ${p}`).join("\n")}`
    : "";
  const userPrompt = `Situation: ${situation}
${languageContextLine}

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
