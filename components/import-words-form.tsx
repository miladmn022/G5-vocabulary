"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ImportWordsFormProps = {
  isAdmin: boolean;
};

export default function ImportWordsForm({ isAdmin }: ImportWordsFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [scope, setScope] = useState<"personal" | "global">("personal");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!file) {
      setError("Please choose a CSV file.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("scope", scope);

      const response = await fetch("/api/words/import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not import words.");
        return;
      }

      setError("");
      setMessage(
        `Imported ${data.importedCount} words as ${data.scope}.`
      );

      setFile(null);
      event.currentTarget.reset();
    } catch {
      setError("Could not connect to import API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        mt-6
        rounded-3xl
        border
        border-gray-100
        bg-white
        p-6
        shadow-sm
      "
    >
      <div>
        <h2
          className="
            text-lg
            font-bold
            text-gray-900
          "
        >
          Import CSV
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-gray-500
          "
        >
          Download the template, fill it in Excel, save it as CSV, then upload it here.
        </p>
      </div>

      <Link
        href="/api/words/template"
        className="
          mt-5
          inline-flex
          items-center
          justify-center
          rounded-xl
          border
          border-gray-200
          px-4
          py-3
          text-sm
          font-medium
          text-gray-700
          hover:bg-gray-50
        "
      >
        Download CSV template
      </Link>

      <form
        onSubmit={handleSubmit}
        className="
          mt-6
          space-y-4
        "
      >
        <div>
          <label className="text-sm font-medium">CSV file</label>

          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(event) =>
              setFile(event.target.files?.[0] || null)
            }
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-gray-200
              px-4
              py-3
              text-sm
              outline-none
              file:mr-4
              file:rounded-lg
              file:border-0
              file:bg-indigo-50
              file:px-3
              file:py-2
              file:text-sm
              file:font-medium
              file:text-indigo-700
            "
          />
        </div>

        {isAdmin ? (
          <div>
            <label className="text-sm font-medium">Import scope</label>

            <select
              value={scope}
              onChange={(event) =>
                setScope(event.target.value as "personal" | "global")
              }
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            >
              <option value="personal">Personal only</option>
              <option value="global">Global for all users</option>
            </select>
          </div>
        ) : null}

        {message ? (
          <p
            className="
              rounded-xl
              bg-emerald-50
              px-4
              py-3
              text-sm
              text-emerald-700
            "
          >
            {message}
          </p>
        ) : null}

        {error ? (
          <p
            className="
              rounded-xl
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
            "
          >
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-xl
            py-6
          "
        >
          {loading ? "Importing..." : "Import words"}
        </Button>
      </form>
    </div>
  );
}
