import Link from "next/link";

export default function AdminLinks() {
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
      <div>
        <p
          className="
            text-sm
            text-gray-500
          "
        >
          Admin
        </p>

        <h2
          className="
            text-lg
            font-bold
            text-gray-900
          "
        >
          Manage workspace
        </h2>
      </div>

      <div
        className="
          mt-4
          grid
          grid-cols-2
          gap-3
        "
      >
        <Link
          href="/admin/words"
          className="
            rounded-2xl
            border
            border-gray-100
            bg-slate-50
            p-4
            text-sm
            font-medium
            text-gray-700
            hover:bg-indigo-50
            hover:text-indigo-700
          "
        >
          Manage Words
        </Link>

        <Link
          href="/admin/users"
          className="
            rounded-2xl
            border
            border-gray-100
            bg-slate-50
            p-4
            text-sm
            font-medium
            text-gray-700
            hover:bg-indigo-50
            hover:text-indigo-700
          "
        >
          Manage Users
        </Link>
      </div>
    </div>
  );
}
