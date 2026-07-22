import Link from "next/link";

type DashboardWordPreviewProps = {
  scope: "global" | "personal";
  words: {
    id: string;
    text: string;
    meaning: string;
    isGlobal: boolean;
  }[];
};

export default function DashboardWordPreview({
  scope,
  words,
}: DashboardWordPreviewProps) {
  return (
    <div
      className="
        mt-5
        rounded-3xl
        border
        border-gray-100
        bg-white
        p-5
        shadow-sm
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div>
          <p className="text-sm text-gray-500">
            Word list
          </p>

          <h2 className="text-lg font-bold text-gray-900">
            {scope === "global" ? "Global words" : "Personal words"}
          </h2>
        </div>

        <Link
          href={`/words?scope=${scope}`}
          className="
            rounded-full
            bg-slate-100
            px-3
            py-1
            text-xs
            font-medium
            text-gray-600
            hover:bg-indigo-50
            hover:text-indigo-700
          "
        >
          View all
        </Link>
      </div>

      <div
        className="
          mt-4
          grid
          grid-cols-2
          gap-3
          sm:grid-cols-3
        "
      >
        {words.length === 0 ? (
          <p className="col-span-2 text-sm text-gray-500 sm:col-span-3">
            No words in this list yet.
          </p>
        ) : (
          words.map((word) => (
            <div
              key={word.id}
              className="
                rounded-2xl
                border
                border-gray-100
                bg-slate-50
                p-3
              "
            >
              <p className="text-sm font-bold text-gray-900">
                {word.text}
              </p>

              <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                {word.meaning}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
