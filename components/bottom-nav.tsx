import Link from "next/link";

export default function BottomNav() {
  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        mx-auto
        flex
        max-w-[768px]
        justify-around
        border-t
        border-gray-100
        bg-white
        py-4
        shadow-[0_-8px_24px_rgba(15,23,42,0.06)]
      "
    >
      <Link
        href="/dashboard"
        className="
          text-center
          text-gray-600
        "
      >
        🏠
        <p className="text-xs">Home</p>
      </Link>

      <Link
        href="/learn"
        className="
          text-center
          text-gray-600
        "
      >
        📚
        <p className="text-xs">Learn</p>
      </Link>

      <Link
        href="/import"
        className="
          text-center
          text-gray-600
        "
      >
        ➕
        <p className="text-xs">Add</p>
      </Link>
    </nav>
  );
}
