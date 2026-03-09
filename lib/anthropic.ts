import Anthropic from "@anthropic-ai/sdk";

export const CLAUDE_MODEL = "claude-haiku-4-5-20251001";

export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export function stripJsonFences(text: string): string {
  return text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
}
