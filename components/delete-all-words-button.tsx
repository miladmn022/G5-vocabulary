"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteAllWordsButtonProps = {
  scope: "global" | "personal";
  canDelete: boolean;
};

export default function DeleteAllWordsButton({
  scope,
  canDelete,
}: DeleteAllWordsButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!canDelete) {
    return null;
  }

  async function handleDeleteAll() {
    const label =
      scope === "global"
        ? "all global words for every user"
        : "all your personal words";

    const confirmed = window.confirm(
      `Delete ${label}? This also removes review history for these words.`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/words/bulk-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scope,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not delete words.");
        return;
      }

      setMessage(`Deleted ${data.deletedCount} words.`);
      router.refresh();
    } catch {
      setError("Could not connect to delete API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        mt-5
        rounded-3xl
        border
        border-red-100
        bg-red-50
        p-4
      "
    >
      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <p className="text-sm font-bold text-red-700">
            Danger zone
          </p>

          <p className="mt-1 text-sm text-red-600">
            {scope === "global"
              ? "Delete all global words."
              : "Delete all your personal words."}
          </p>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleDeleteAll}
          className="
            rounded-2xl
            bg-red-600
            px-4
            py-3
            text-sm
            font-medium
            text-white
            hover:bg-red-700
            disabled:opacity-60
          "
        >
          {loading ? "Deleting..." : "Delete all"}
        </button>
      </div>

      {message ? (
        <p className="mt-3 rounded-xl bg-white px-4 py-3 text-sm text-red-700">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="mt-3 rounded-xl bg-white px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
