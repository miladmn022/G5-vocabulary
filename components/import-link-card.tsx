import Link from "next/link";

export default function ImportLinkCard() {
  return (
    <Link
      href="/import"
      className="
        mt-5
        block
        rounded-3xl
        border
        border-gray-100
        bg-white
        p-5
        shadow-sm
        hover:bg-indigo-50
      "
    >
      <p
        className="
          text-sm
          text-gray-500
        "
      >
        Vocabulary
      </p>

      <h2
        className="
          mt-1
          text-lg
          font-bold
          text-gray-900
        "
      >
        Import words
      </h2>

      <p
        className="
          mt-2
          text-sm
          text-gray-500
        "
      >
        Upload a CSV file and add multiple words at once.
      </p>
    </Link>
  );
}
