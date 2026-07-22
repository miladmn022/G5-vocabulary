"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ImportWordsFormProps = {
  isAdmin: boolean;
};

const MAX_IMPORT_ROWS = 500;

function countCsvRows(content: string) {
  return content
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean).length - 1;
}

export default function ImportWordsForm({ isAdmin }: ImportWordsFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [scope, setScope] = useState<"personal" | "global">("personal");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleFileChange(selectedFile: File | null) {
    setFile(selectedFile);
    setRowCount(null);
    setMessage("");
    setError("");

    if (!selectedFile) {
      return;
    }

    const content = await selectedFile.text();
    const count = countCsvRows(content);

    setRowCount(count);

    if (count > MAX_IMPORT_ROWS) {
      setError(
        `This file has ${count} rows. Please import up to ${MAX_IMPORT_ROWS} rows at a time.`
      );
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!file) {
      setError("Please choose a CSV file.");
      return;
    }

    if (rowCount !== null && rowCount > MAX_IMPORT_ROWS) {
      setError(
        `This file has ${rowCount} rows. Please split it into smaller files.`
      );
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
      const summary = data.levelSummary
        ? ` Beginner: ${data.levelSummary.beginner}, Intermediate: ${data.levelSummary.intermediate}, Advanced: ${data.levelSummary.advanced}.`
        : "";

      setMessage(
        `Imported ${data.importedCount} of ${data.processedCount ?? rowCount ?? data.importedCount} rows as ${data.scope}.${summary}`
      );

      setFile(null);
      setRowCount(null);
      event.currentTarget.reset();
    } catch {
      setError("Could not connect to import API. Please try a smaller file.");
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
        <h2 className="text-lg font-bold text-gray-900">
          Import CSV
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Download the template, fill it in Excel, save it as CSV, then upload it here.
          Regular users import personal words only. Admins can import global words for everyone.
        </p>

        <p className="mt-2 text-sm text-amber-600">
          Import limit: {MAX_IMPORT_ROWS} rows per file. Split large lists into smaller batches.
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
        className="mt-6 space-y-4"
      >
        <div>
          <label className="text-sm font-medium">CSV file</label>

          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(event) =>
              handleFileChange(event.target.files?.[0] || null)
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

          {rowCount !== null ? (
            <p className="mt-2 text-sm text-gray-500">
              Detected rows: {rowCount} / Max {MAX_IMPORT_ROWS}
            </p>
          ) : null}
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

        {loading ? (
          <p className="rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            Importing {rowCount ?? ""} rows. Please wait...
          </p>
        ) : null}

        {message ? (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={loading || (rowCount !== null && rowCount > MAX_IMPORT_ROWS)}
          className="w-full rounded-xl py-6"
        >
          {loading ? "Importing..." : "Import words"}
        </Button>
      </form>
    </div>
  );
}
