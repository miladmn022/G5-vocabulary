import Link from "next/link";

export default function InstallButton() {
  return (
    <Link
      href="/install"
      className="
        inline-flex
        h-10
        items-center
        justify-center
        rounded-full
        border
        border-indigo-100
        bg-indigo-50
        px-4
        text-sm
        font-medium
        text-indigo-700
        shadow-sm
        transition
        hover:bg-indigo-100
      "
    >
      Install
    </Link>
  );
}
