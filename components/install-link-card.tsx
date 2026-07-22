import Link from "next/link";

export default function InstallLinkCard() {
  return (
    <Link
      href="/install"
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
      <p className="text-sm text-gray-500">App shortcut</p>
      <h2 className="mt-1 text-lg font-bold text-gray-900">Install G5</h2>
      <p className="mt-2 text-sm text-gray-500">
        Add G5 to your phone home screen for faster access.
      </p>
    </Link>
  );
}
