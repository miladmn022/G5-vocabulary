"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DailyGoalSelectorProps = {
  dailyGoal: number;
};

const options = [
  {
    value: 10,
    label: "10",
    description: "Light",
  },
  {
    value: 20,
    label: "20",
    description: "Balanced",
  },
  {
    value: 30,
    label: "30",
    description: "Focused",
  },
  {
    value: 40,
    label: "40",
    description: "Intensive",
  },
  {
    value: 50,
    label: "50",
    description: "Challenge",
  },
];

export default function DailyGoalSelector({
  dailyGoal,
}: DailyGoalSelectorProps) {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState(dailyGoal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function updateGoal(value: number) {
    setSelectedGoal(value);
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/me/preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dailyGoal: value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not update daily goal.");
        setSelectedGoal(dailyGoal);
        return;
      }

      router.refresh();
    } catch {
      setError("Could not connect to preferences API.");
      setSelectedGoal(dailyGoal);
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
        <p className="text-sm text-gray-500">Daily goal</p>

        <h2 className="text-lg font-bold text-gray-900">
          Choose your pace
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          A 10–15 minute session is usually around 20 words.
        </p>
      </div>

      <div
        className="
          mt-4
          grid
          grid-cols-5
          gap-2
        "
      >
        {options.map((option) => {
          const isSelected = selectedGoal === option.value;

          return (
            <button
              key={option.value}
              type="button"
              disabled={loading}
              onClick={() => updateGoal(option.value)}
              className={`
                rounded-2xl
                border
                p-3
                text-center
                transition
                ${
                  isSelected
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                    : "border-gray-100 bg-slate-50 text-gray-600 hover:bg-indigo-50"
                }
              `}
            >
              <span className="block text-base font-bold">
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
