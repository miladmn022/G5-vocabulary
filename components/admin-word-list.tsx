type AdminWordListItem = {
  id: string;
  text: string;
  meaning: string;
  isGlobal: boolean;
  source: string;
  level: number;
  createdAt: Date;
};

type AdminWordListProps = {
  words: AdminWordListItem[];
};

export default function AdminWordList({ words }: AdminWordListProps) {
  return (
    <div
      className="
        mt-8
        rounded-3xl
        border
        border-gray-100
        bg-white
        p-5
        shadow-sm
      "
    >
      <div>
        <p className="text-sm text-gray-500">Words</p>
        <h2 className="text-lg font-bold text-gray-900">Latest words</h2>
      </div>

      <div className="mt-5 space-y-3">
        {words.length === 0 ? (
          <p className="text-sm text-gray-500">No words yet.</p>
        ) : (
          words.map((word) => (
            <div
              key={word.id}
              className="
                rounded-2xl
                border
                border-gray-100
                bg-slate-50
                p-4
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
                  <h3 className="font-bold text-gray-900">{word.text}</h3>
                  <p className="mt-1 text-sm text-gray-600">{word.meaning}</p>
                </div>

                <span
                  className="
                    rounded-full
                    bg-white
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-gray-600
                  "
                >
                  {word.isGlobal ? "Global" : "Personal"}
                </span>
              </div>

              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  gap-2
                  text-xs
                  text-gray-500
                "
              >
                <span>Level {word.level}</span>
                <span>•</span>
                <span>{word.source}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
