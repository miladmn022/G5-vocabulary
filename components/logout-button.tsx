"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleLogout}
      aria-label="Logout"
      title="Logout"
      className="
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-full
        border
        border-gray-200
        bg-white
        text-gray-500
        shadow-sm
        transition
        hover:border-red-100
        hover:bg-red-50
        hover:text-red-600
        disabled:opacity-60
      "
    >
      <LogOut className="h-5 w-5" />
    </button>
  );
}
