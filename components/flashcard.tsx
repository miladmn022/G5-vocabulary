"use client";

import { useEffect, useState } from "react";

type FlashcardWord = {
  text: string;
  meaning: string;
  synonyms: string | null;
  antonyms: string | null;
  example: string | null;
};

type FlashcardProps = {
  word: FlashcardWord;
};

export default function Flashcard({ word }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [word.text]);

  return (
    <button
      type="button"
      className="
        perspective
        relative
        block
        h-[340px]
        w-full
        cursor-pointer
        text-left
        outline-none
      "
      onClick={() => setFlipped(!flipped)}
      aria-label="Flip flashcard"
    >
      <div
        className={`
          absolute
          inset-0
          transform-style-preserve-3d
          transition-transform
          duration-500
          ${flipped ? "rotate-y-180" : ""}
        `}
      >
        <div
          className="
            backface-hidden
            absolute
            inset-0
            overflow-hidden
            rounded-[2rem]
            border
            border-indigo-100
            bg-gradient-to-br
            from-white
            via-indigo-50
            to-white
            p-7
            shadow-[0_24px_60px_rgba(79,70,229,0.18)]
          "
        >
          <div
            className="
              absolute
              -right-10
              -top-10
              h-32
              w-32
              rounded-full
              bg-indigo-100
              opacity-70
            "
          />

          <div
            className="
              absolute
              bottom-0
              left-8
              right-8
              h-3
              rounded-t-full
              bg-indigo-200/60
            "
          />

          <div className="relative flex h-full flex-col items-center justify-center">
            <div
              className="
                mb-6
                rounded-full
                bg-white
                px-4
                py-2
                text-xs
                font-semibold
                text-indigo-600
                shadow-sm
              "
            >
              Tap the card to reveal
            </div>

            <h2
              className="
                text-center
                text-4xl
                font-black
                tracking-tight
                text-indigo-700
              "
            >
              {word.text}
            </h2>

            <div
              className="
                mt-8
                flex
                items-center
                gap-2
                rounded-full
                border
                border-indigo-100
                bg-white/80
                px-4
                py-2
                text-sm
                font-medium
                text-gray-500
                shadow-sm
              "
            >
              <span>↻</span>
              <span>Flip card</span>
            </div>
          </div>
        </div>

        <div
          className="
            backface-hidden
            rotate-y-180
            absolute
            inset-0
            overflow-y-auto
            rounded-[2rem]
            border
            border-emerald-100
            bg-white
            p-7
            shadow-[0_24px_60px_rgba(16,185,129,0.16)]
          "
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Meaning
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-900">
                {word.text}
              </h2>
            </div>

            <div
              className="
                rounded-full
                bg-emerald-50
                px-3
                py-1
                text-xs
                font-semibold
                text-emerald-700
              "
            >
              Back
            </div>
          </div>

          <div className="space-y-4 text-gray-700">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-gray-400">Meaning</p>
              <p className="mt-1 font-medium">{word.meaning}</p>
            </div>

            {word.synonyms ? (
              <div className="rounded-2xl bg-indigo-50 p-4">
                <p className="text-xs font-semibold text-indigo-500">
                  Synonyms
                </p>
                <p className="mt-1 text-sm">{word.synonyms}</p>
              </div>
            ) : null}

            {word.antonyms ? (
              <div className="rounded-2xl bg-rose-50 p-4">
                <p className="text-xs font-semibold text-rose-500">
                  Antonyms
                </p>
                <p className="mt-1 text-sm">{word.antonyms}</p>
              </div>
            ) : null}

            {word.example ? (
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-xs font-semibold text-amber-600">
                  Example
                </p>
                <p className="mt-1 text-sm">{word.example}</p>
              </div>
            ) : null}
          </div>

          <p className="mt-5 text-center text-xs text-gray-400">
            Tap again to go back
          </p>
        </div>
      </div>
    </button>
  );
}
