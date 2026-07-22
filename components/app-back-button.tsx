"use client";

import { useRouter } from "next/navigation";

export default function AppBackButton() {
  const router = useRouter();

  function goBack() {
    router.push("/dashboard");
  }

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Back to dashboard"
      className="
        fixed
        left-4
        top-4
        z-50
        flex
        h-11
        w-11
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
