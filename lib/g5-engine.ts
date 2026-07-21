export type ReviewRating = "AGAIN" | "HARD" | "GOOD" | "EASY";

type CalculateG5ReviewInput = {
  currentLevel: number;
  currentInterval: number;
  rating: ReviewRating;
};

type CalculateG5ReviewOutput = {
  nextLevel: number;
  nextInterval: number;
  nextReviewAt: Date;
};

const MIN_LEVEL = 0;
const MAX_LEVEL = 5;

function clampLevel(level: number) {
  return Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, level));
}

function addMinutes(date: Date, minutes: number) {
  const nextDate = new Date(date);
  nextDate.setMinutes(nextDate.getMinutes() + minutes);
  return nextDate;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function calculateG5Review({
  currentLevel,
  currentInterval,
  rating,
}: CalculateG5ReviewInput): CalculateG5ReviewOutput {
  const now = new Date();

  let nextLevel = currentLevel;
  let nextInterval = currentInterval;
  let nextReviewAt = now;

  switch (rating) {
    case "AGAIN":
      nextLevel = clampLevel(currentLevel - 1);
      nextInterval = 0;
      nextReviewAt = addMinutes(now, 10);
      break;

    case "HARD":
      nextLevel = clampLevel(currentLevel + 0.5);
      nextInterval = Math.max(1, Math.round(currentInterval * 1.2));
      nextReviewAt = addDays(now, nextInterval);
      break;

    case "GOOD":
      nextLevel = clampLevel(currentLevel + 1);
      nextInterval = Math.max(3, Math.round(currentInterval * 2));
      nextReviewAt = addDays(now, nextInterval);
      break;

    case "EASY":
      nextLevel = clampLevel(currentLevel + 2);
      nextInterval = Math.max(7, Math.round(currentInterval * 3));
      nextReviewAt = addDays(now, nextInterval);
      break;
  }

  return {
    nextLevel,
    nextInterval,
    nextReviewAt,
  };
}
