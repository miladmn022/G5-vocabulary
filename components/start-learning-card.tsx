"use client";

import Link from "next/link";
import { useState } from "react";

type StartLearningCardProps = {
  personalWordsCount?: number;
};

export default function StartLearningCard({
  personalWordsCount = 0,
}: StartLearningCardProps) {
  const [open, setOpen] = useState(false);
  const hasPersonalWords = personalWordsCount > 0;

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="
          block
          w-full
          rounded-3xl
          bg-gradient-to-br
          from-indigo-600
          to-violet-600
          p-6
          text-left
          text-white
          shadow-lg
          transition
          hover:scale-[1.01]
          active:scale-[0.99]
        "
      >
        <p className="text-sm text-indigo-100">
          Daily practice
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Start learning
        </h2>

        <p className="mt-2 text-sm text-indigo-100">
          Choose global or personal words for this session.
        </p>

        <div
          className="
            mt-5
            inline-flex
            rounded-full
            bg-white/15
            px-4
            py-2
            text-sm
            font-medium
          "
        >
          Choose list →
        </div>
      </button>

      {open ? (
        <div
          className="
            mt-3
            grid
            grid-cols-1
            gap-3
            rounded-3xl
            border
            border-gray-100
            bg-white
            p-4
            shadow-sm
            sm:grid-cols-2
          "
        >
          <Link
            href="/learn?scope=global"
            className="
              rounded-2xl
              border
              border-indigo-100
              bg-indigo-50
              p-4
              text-center
              transition
              hover:bg-indigo-100
            "
          >
            <div className="text-2xl">🌍</div>

            <h3 className="mt-2 font-bold text-indigo-900">
              Global words
            </h3>

            <p className="mt-1 text-xs text-indigo-600">
              Practice shared vocabulary.
            </p>
          </Link>

          {hasPersonalWords ? (
            <Link
              href="/learn?scope=personal"
              className="
                rounded-2xl
                border
                border-emerald-100
                bg-emerald-50
                p-4
                text-center
                transition
                hover:bg-emerald-100
              "
            >
              <div className="text-2xl">⭐</div>

              <h3 className="mt-2 font-bold text-emerald-900">
                Personal words
              </h3>

              <p className="mt-1 text-xs text-emerald-600">
                Practice your own imported words.
              </p>
            </Link>
          ) : (
            <div
              className="
                rounded-2xl
                border
                border-gray-100
                bg-slate-50
                p-4
                text-center
                opacity-70
              "
            >
              <div className="text-2xl">⭐</div>

              <h3 className="mt-2 font-bold text-gray-500">
                Personal words
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                No personal words yet.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
