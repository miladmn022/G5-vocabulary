export type WordLevelLabel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export function getWordLevelLabel(level: number | null | undefined) {
  if (!level || level <= 1) {
    return "Beginner";
  }

  if (level === 2) {
    return "Intermediate";
  }

  return "Advanced";
}

export function getWordLevelValue(level: WordLevelLabel) {
  if (level === "BEGINNER") {
    return 1;
  }

  if (level === "INTERMEDIATE") {
    return 2;
  }

  return 3;
}
