"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminWordForm() {
  const [text, setText] = useState("");
  const [meaning, setMeaning] = useState("");
  const [synonyms, setSynonyms] = useState("");
  const [antonyms, setAntonyms] = useState("");
  const [example, setExample] = useState("");
  const [level, setLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/words", {
        method: "POST",
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
        setError(data.error || "Could not save word.");
        return;
      }

      setMessage(`Saved ${data.word.text}`);
      setText("");
      setMeaning("");
      setSynonyms("");
      setAntonyms("");
      setExample("");
      setLevel(0);
    } catch {
      setError("Could not connect to admin API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        mt-6
        space-y-4
      "
    >
      <div>
        <label className="text-sm font-medium">Word</label>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Example: Focus"
          className="
            mt-2
            w-full
            rounded-xl
            border
            border-gray-200
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-indigo-500
          "
        />
      </div>

      <div>
        <label className="text-sm font-medium">Meaning</label>
        <input
          value={meaning}
          onChange={(event) => setMeaning(event.target.value)}
          placeholder="مثلاً: تمرکز"
          className="
            mt-2
            w-full
            rounded-xl
            border
            border-gray-200
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-indigo-500
          "
        />
      </div>

      <div>
        <label className="text-sm font-medium">Synonyms</label>
        <input
          value={synonyms}
          onChange={(event) => setSynonyms(event.target.value)}
          placeholder="concentration, attention"
          className="
            mt-2
            w-full
            rounded-xl
            border
            border-gray-200
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-indigo-500
          "
        />
      </div>

      <div>
        <label className="text-sm font-medium">Antonyms</label>
        <input
          value={antonyms}
          onChange={(event) => setAntonyms(event.target.value)}
          placeholder="distraction"
          className="
            mt-2
            w-full
            rounded-xl
            border
            border-gray-200
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-indigo-500
          "
        />
      </div>

      <div>
        <label className="text-sm font-medium">Example</label>
        <textarea
          value={example}
          onChange={(event) => setExample(event.target.value)}
          placeholder="I need focus to study."
          className="
            mt-2
            min-h-24
            w-full
            rounded-xl
            border
            border-gray-200
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-indigo-500
          "
        />
      </div>

      <div>
        <label className="text-sm font-medium">Level</label>
        <input
          type="number"
          min={0}
          max={5}
          value={level}
          onChange={(event) => setLevel(Number(event.target.value))}
          className="
            mt-2
            w-full
            rounded-xl
            border
            border-gray-200
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-indigo-500
          "
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

      <Button
        type="submit"
        disabled={loading}
        className="
          w-full
          rounded-xl
          py-6
        "
      >
        {loading ? "Saving..." : "Save word"}
      </Button>
    </form>
  );
}
