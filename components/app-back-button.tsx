"use client";

import { useRouter } from "next/navigation";

export default function AppBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/dashboard")}
      aria-label="Back to dashboard"
      className="
        inline-flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        border
        border-gray-200
        bg-white
        text-lg
        text-gray-700
        shadow-sm
        transition
        hover:bg-indigo-50
        hover:text-indigo-700
      "
    >
      ←
    </button>
  );
}
