export type SaveStatus = "learning" | "mastered";

export interface SavedPhrase {
  id: string;               // crypto.randomUUID()
  phrase: string;           // Target-language phrase (dedup key)
  gloss: string;            // English translation / explanation
  note: string;             // Regional tip (empty string for correction phrases)
  detectedLanguage: string;
  detectedRegion: string;
  sourceQuery: string;      // Original SmartBar input
  savedAt: number;          // Date.now()
  status: SaveStatus;
}
