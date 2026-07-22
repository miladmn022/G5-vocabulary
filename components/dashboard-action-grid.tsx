import Link from "next/link";

type DashboardActionGridProps = {
  isAdmin: boolean;
};

export default function DashboardActionGrid({
  isAdmin,
}: DashboardActionGridProps) {
  return (
    <div
      className="
        mt-5
        grid
        grid-cols-2
        gap-3
      "
    >
      <Link
        href="/import"
        className="
          rounded-3xl
          border
          border-gray-100
          bg-white
          p-4
          shadow-sm
          transition
          hover:bg-indigo-50
        "
      >
        <p className="text-xl">➕</p>
        <h2 className="mt-2 text-base font-bold text-gray-900">Import</h2>
        <p className="mt-1 text-xs text-gray-500">
          Add words by CSV.
        </p>
      </Link>

      {isAdmin ? (
        <Link
          href="/admin/words"
          className="
            rounded-3xl
            border
            border-gray-100
            bg-white
            p-4
            shadow-sm
            transition
            hover:bg-indigo-50
          "
        >
          <p className="text-xl">⚙️</p>
          <h2 className="mt-2 text-base font-bold text-gray-900">Manage</h2>
          <p className="mt-1 text-xs text-gray-500">
            Words and users.
          </p>
        </Link>
      ) : (
        <Link
          href="/learn"
          className="
            rounded-3xl
            border
            border-gray-100
            bg-white
            p-4
            shadow-sm
            transition
            hover:bg-indigo-50
          "
        >
          <p className="text-xl">📚</p>
          <h2 className="mt-2 text-base font-bold text-gray-900">Learn</h2>
          <p className="mt-1 text-xs text-gray-500">
            Review due words.
          </p>
        </Link>
      )}
    </div>
  );
}
