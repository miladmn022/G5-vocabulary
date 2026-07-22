"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type WordEditorProps = {
  word: {
    id: string;
    text: string;
    meaning: string;
    synonyms: string | null;
    antonyms: string | null;
    example: string | null;
    level: number;
    isGlobal: boolean;
  };
};

function normalizeLevel(level: number) {
  if (level <= 1) {
    return 1;
  }

  if (level === 2) {
    return 2;
  }

  return 3;
}

export default function WordEditor({ word }: WordEditorProps) {
  const router = useRouter();

  const [text, setText] = useState(word.text);
  const [meaning, setMeaning] = useState(word.meaning);
  const [synonyms, setSynonyms] = useState(word.synonyms || "");
  const [antonyms, setAntonyms] = useState(word.antonyms || "");
  const [example, setExample] = useState(word.example || "");
  const [level, setLevel] = useState(normalizeLevel(word.level));
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function saveWord() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/words/${word.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          meaning,
          synonyms,
          antonyms,
          example,
          level,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not update word.");
        return;
      }

      setMessage("Word updated.");
      router.refresh();
    } catch {
      setError("Could not connect to word API.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteWord() {
    const confirmed = window.confirm(
      "Delete this word? This also removes its review history."
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/words/${word.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not delete word.");
        return;
      }

      router.push(word.isGlobal ? "/words?scope=global" : "/words?scope=personal");
      router.refresh();
    } catch {
      setError("Could not connect to word API.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className="
        rounded-3xl
        border
        border-gray-100
        bg-white
        p-6
        shadow-sm
      "
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Word / phrase</label>
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Meaning</label>
          <input
            value={meaning}
            onChange={(event) => setMeaning(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Level</label>
          <select
            value={level}
            onChange={(event) => setLevel(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={1}>Beginner</option>
            <option value={2}>Intermediate</option>
            <option value={3}>Advanced</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Synonyms</label>
          <input
            value={synonyms}
            onChange={(event) => setSynonyms(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Antonyms</label>
          <input
            value={antonyms}
            onChange={(event) => setAntonyms(event.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Example</label>
          <textarea
            value={example}
            onChange={(event) => setExample(event.target.value)}
            className="mt-2 min-h-24 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

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

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            disabled={loading || deleting}
            onClick={saveWord}
            className="rounded-xl py-6"
          >
            {loading ? "Saving..." : "Save"}
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={loading || deleting}
            onClick={deleteWord}
            className="rounded-xl py-6 text-red-600 hover:bg-red-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
