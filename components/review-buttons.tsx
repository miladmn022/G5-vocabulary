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
        mt-6
        grid
        grid-cols-2
        gap-3
        sm:grid-cols-4
      "
    >
      <Button
        disabled={disabled}
        onClick={() => onReview("AGAIN")}
        className="
          rounded-2xl
          bg-rose-500
          py-6
          text-white
          shadow-sm
          hover:bg-rose-600
        "
      >
        Again
      </Button>

      <Button
        disabled={disabled}
        onClick={() => onReview("HARD")}
        className="
          rounded-2xl
          bg-amber-500
          py-6
          text-white
          shadow-sm
          hover:bg-amber-600
        "
      >
        Hard
      </Button>

      <Button
        disabled={disabled}
        onClick={() => onReview("GOOD")}
        className="
          rounded-2xl
          bg-emerald-500
          py-6
          text-white
          shadow-sm
          hover:bg-emerald-600
        "
      >
        Good
      </Button>

      <Button
        disabled={disabled}
        onClick={() => onReview("EASY")}
        className="
          rounded-2xl
          bg-indigo-600
          py-6
          text-white
          shadow-sm
          hover:bg-indigo-700
        "
      >
        Easy
      </Button>
    </div>
  );
}
