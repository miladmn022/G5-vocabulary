type LearningHeaderProps = {
  current?: number;
  total?: number;
};

export default function LearningHeader({
  current = 1,
  total = 10,
}: LearningHeaderProps) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        py-6
      "
    >
      <div>
        <p
          className="
            text-sm
            text-gray-500
          "
        >
          Today's Review
        </p>

        <h1
          className="
            text-2xl
            font-bold
          "
        >
          Learn Words
        </h1>
      </div>

      <div
        className="
          rounded-full
          bg-indigo-100
          px-4
          py-2
          text-sm
          font-medium
          text-indigo-700
        "
      >
        {current} / {total}
      </div>
    </div>
  );
}
