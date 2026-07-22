import Link from "next/link";

export default function StartLearningCard() {
  return (
    <Link
      href="/learn"
      className="
        mt-5
        block
        rounded-3xl
        bg-gradient-to-br
        from-indigo-600
        to-violet-600
        p-6
        text-white
        shadow-lg
        transition
        hover:scale-[1.01]
        active:scale-[0.99]
      "
    >
      <p className="text-sm text-indigo-100">
        Daily practice
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        Start learning
      </h2>

      <p className="mt-2 text-sm text-indigo-100">
        Review your due words in a short 10–15 minute session.
      </p>

      <div
        className="
          mt-5
          inline-flex
          rounded-full
          bg-white/15
          px-4
          py-2
          text-sm
          font-medium
        "
      >
        Continue →
      </div>
    </Link>
  );
}
