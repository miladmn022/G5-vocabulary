import { Button } from "@/components/ui/button";

type ReviewRating = "AGAIN" | "HARD" | "GOOD" | "EASY";

type ReviewButtonsProps = {
  disabled?: boolean;
  onReview: (rating: ReviewRating) => void;
};

export default function ReviewButtons({
  disabled = false,
  onReview,
}: ReviewButtonsProps) {
  return (
    <div
      className="
        grid
        grid-cols-4
        gap-2
        mt-6
      "
    >
      <Button
        variant="outline"
        disabled={disabled}
        onClick={() => onReview("AGAIN")}
      >
        Again
      </Button>

      <Button
        variant="outline"
        disabled={disabled}
        onClick={() => onReview("HARD")}
      >
        Hard
      </Button>

      <Button
        className="
          bg-emerald-500
          hover:bg-emerald-600
        "
        disabled={disabled}
        onClick={() => onReview("GOOD")}
      >
        Good
      </Button>

      <Button
        className="
          bg-indigo-600
          hover:bg-indigo-700
        "
        disabled={disabled}
        onClick={() => onReview("EASY")}
      >
        Easy
      </Button>
    </div>
  );
}
