"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ImportWordsFormProps = {
  isAdmin: boolean;
};

type CsvRow = {
  text: string;
  meaning: string;
  synonyms: string;
  antonyms: string;
  example: string;
  level: number;
};

const MAX_IMPORT_ROWS = 500;
const BATCH_SIZE = 50;

function splitCsvLine(line: string) {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);

  return result.map((value) => value.trim());
}

function normalizeLevel(value: string) {
  const level = Number(value);

  if (!Number.isFinite(level) || level <= 1) {
    return 1;
  }

  if (level === 2) {
    return 2;
  }

  return 3;
}

function parseCsv(content: string) {
  const lines = content
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  const [headerLine, ...dataLines] = lines;
  const headers = splitCsvLine(headerLine).map((header) =>
    header.toLowerCase()
  );

  const textIndex = headers.indexOf("text");
  const meaningIndex = headers.indexOf("meaning");
  const synonymsIndex = headers.indexOf("synonyms");
  const antonymsIndex = headers.indexOf("antonyms");
  const exampleIndex = headers.indexOf("example");
  const levelIndex = headers.indexOf("level");

  if (textIndex === -1 || meaningIndex === -1) {
    throw new Error("CSV must include text and meaning columns.");
  }

  return dataLines
    .map((line) => {
      const values = splitCsvLine(line);

      return {
        text: values[textIndex] || "",
        meaning: values[meaningIndex] || "",
        synonyms: synonymsIndex >= 0 ? values[synonymsIndex] || "" : "",
        antonyms: antonymsIndex >= 0 ? values[antonymsIndex] || "" : "",
        example: exampleIndex >= 0 ? values[exampleIndex] || "" : "",
        level: normalizeLevel(levelIndex >= 0 ? values[levelIndex] || "" : ""),
      };
    })
    .filter((row) => row.text.trim() && row.meaning.trim());
}

export default function ImportWordsForm({ isAdmin }: ImportWordsFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [scope, setScope] = useState<"personal" | "global">("personal");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleFileChange(selectedFile: File | null) {
    setFile(selectedFile);
    setRows([]);
    setMessage("");
    setError("");
    setProgress("");

    if (!selectedFile) {
      return;
    }

    try {
      const content = await selectedFile.text();
      const parsedRows = parseCsv(content);

      setRows(parsedRows);

      if (parsedRows.length > MAX_IMPORT_ROWS) {
        setError(
          `This file has ${parsedRows.length} valid rows. Please import up to ${MAX_IMPORT_ROWS} rows at a time.`
        );
      }
    } catch (parseError) {
      setError(
        parseError instanceof Error
          ? parseError.message
          : "Could not read CSV file."
      );
    }
  }

  async function importBatch(batchRows: CsvRow[]) {
    const response = await fetch("/api/words/import-batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rows: batchRows,
        scope,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not import batch.");
    }

    return data.importedCount as number;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");
    setProgress("");

    if (!file) {
      setError("Please choose a CSV file.");
      return;
    }

    if (rows.length === 0) {
      setError("No valid rows found.");
      return;
    }

    if (rows.length > MAX_IMPORT_ROWS) {
      setError(
        `This file has ${rows.length} valid rows. Please split it into smaller files.`
      );
      return;
    }

    setLoading(true);

    try {
      let importedTotal = 0;

      for (let start = 0; start < rows.length; start += BATCH_SIZE) {
        const batch = rows.slice(start, start + BATCH_SIZE);
        setProgress(
          `Importing ${Math.min(start + batch.length, rows.length)} of ${rows.length} rows...`
        );

        const importedCount = await importBatch(batch);
        importedTotal += importedCount;
      }

      setProgress("");
      setMessage(
        `Imported ${importedTotal} of ${rows.length} rows as ${scope}.`
      );

      setFile(null);
      setRows([]);
      event.currentTarget.reset();
    } catch (importError) {
      setError(
        importError instanceof Error
          ? importError.message
          : "Could not import words."
      );
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
          Import limit: {MAX_IMPORT_ROWS} rows per file. Large files are imported in batches of {BATCH_SIZE}.
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

          {rows.length > 0 ? (
            <p className="mt-2 text-sm text-gray-500">
              Detected rows: {rows.length} / Max {MAX_IMPORT_ROWS}
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

        {progress ? (
          <p className="rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            {progress}
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
          disabled={loading || rows.length === 0 || rows.length > MAX_IMPORT_ROWS}
          className="w-full rounded-xl py-6"
        >
          {loading ? "Importing..." : "Import words"}
        </Button>
      </form>
    </div>
  );
}
