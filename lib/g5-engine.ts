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

function addHours(date: Date, hours: number) {
  const nextDate = new Date(date);
  nextDate.setHours(nextDate.getHours() + hours);
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

  switch (rating) {
    case "AGAIN": {
      return {
        nextLevel: clampLevel(currentLevel - 1),
        nextInterval: 0,
        nextReviewAt: addMinutes(now, 3),
      };
    }

    case "HARD": {
      return {
        nextLevel: clampLevel(currentLevel + 0.5),
        nextInterval: 1,
        nextReviewAt: addHours(now, 6),
      };
    }

    case "GOOD": {
      const nextInterval = Math.max(1, Math.round(currentInterval * 2));

      return {
        nextLevel: clampLevel(currentLevel + 1),
        nextInterval,
        nextReviewAt: addDays(now, nextInterval),
      };
    }

    case "EASY": {
      return {
        nextLevel: MAX_LEVEL,
        nextInterval: 0,
        nextReviewAt: addDays(now, 3650),
      };
    }
  }
}
