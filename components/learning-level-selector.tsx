"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LearningLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

type LearningLevelSelectorProps = {
  learningLevel: LearningLevel;
};

const options: {
  value: LearningLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "BEGINNER",
    label: "Beginner",
    description: "Essential daily words",
  },
  {
    value: "INTERMEDIATE",
    label: "Intermediate",
    description: "B1/B2 conversations",
  },
  {
    value: "ADVANCED",
    label: "Advanced",
    description: "Films, nuance, deeper talk",
  },
];

export default function LearningLevelSelector({
  learningLevel,
}: LearningLevelSelectorProps) {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<LearningLevel>(learningLevel);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function updateLevel(value: LearningLevel) {
    setSelectedLevel(value);
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/me/preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          learningLevel: value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not update level.");
        setSelectedLevel(learningLevel);
        return;
      }

      router.refresh();
    } catch {
      setError("Could not connect to preferences API.");
      setSelectedLevel(learningLevel);
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
        border-gray-100
        bg-white
        p-5
        shadow-sm
      "
    >
      <div>
        <p className="text-sm text-gray-500">Learning level</p>
        <h2 className="text-lg font-bold text-gray-900">
          What is your level?
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          This helps G5 show the right word list for you.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {options.map((option) => {
          const active = selectedLevel === option.value;

          return (
            <button
              key={option.value}
              type="button"
              disabled={loading}
              onClick={() => updateLevel(option.value)}
              className={`
                rounded-2xl
                border
                p-3
                text-center
                transition
                ${
                  active
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                    : "border-gray-100 bg-slate-50 text-gray-600 hover:bg-indigo-50"
                }
              `}
            >
              <span className="block text-sm font-bold">
                {option.label}
              </span>
              <span className="mt-1 block text-[10px]">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
