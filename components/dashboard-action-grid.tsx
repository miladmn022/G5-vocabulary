import Link from "next/link";

type DashboardActionGridProps = {
  isAdmin: boolean;
};

export default function DashboardActionGrid({
  isAdmin,
}: DashboardActionGridProps) {
  return (
    <section className="mt-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Manage
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/admin/words"
          className="
            rounded-3xl
            border
            border-gray-100
            bg-white
            p-5
            shadow-sm
            transition
            hover:border-indigo-100
            hover:bg-indigo-50
          "
        >
          <div className="text-2xl">🔤</div>

          <h3 className="mt-3 font-bold text-gray-900">
            Manage words
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Add and manage vocabulary words.
          </p>
        </Link>

        <Link
          href="/import"
          className="
            rounded-3xl
            border
            border-gray-100
            bg-white
            p-5
            shadow-sm
            transition
            hover:border-indigo-100
            hover:bg-indigo-50
          "
        >
          <div className="text-2xl">📥</div>

          <h3 className="mt-3 font-bold text-gray-900">
            Import words
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Upload CSV words into your list.
          </p>
        </Link>

        {isAdmin ? (
          <Link
            href="/admin/users"
            className="
              rounded-3xl
              border
              border-gray-100
              bg-white
              p-5
              shadow-sm
              transition
              hover:border-indigo-100
              hover:bg-indigo-50
            "
          >
            <div className="text-2xl">👥</div>

            <h3 className="mt-3 font-bold text-gray-900">
              Manage users
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Create learners and manage access.
            </p>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
