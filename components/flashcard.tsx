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
    <div
      className="
        relative
        h-[320px]
        w-full
        cursor-pointer
      "
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT */}
        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            rounded-3xl
            bg-white
            p-8
            shadow-lg
            border
            border-gray-100
            backface-hidden
          "
        >
          <div>
            <h2
              className="
                text-4xl
                font-bold
                text-indigo-700
                text-center
              "
            >
              {word.text}
            </h2>

            <p
              className="
                mt-5
                text-center
                text-gray-400
              "
            >
              Tap to reveal
            </p>
          </div>
        </div>

        {/* BACK */}
        <div
          className="
            absolute
            inset-0
            rounded-3xl
            bg-white
            p-8
            shadow-lg
            border
            border-gray-100
            rotate-y-180
            backface-hidden
            overflow-y-auto
          "
        >
          <h2
            className="
              text-2xl
              font-bold
            "
          >
            {word.text}
          </h2>

          <div
            className="
              mt-6
              space-y-3
              text-gray-600
            "
          >
            <p>
              <strong>Meaning:</strong> {word.meaning}
            </p>

            {word.synonyms ? (
              <p>
                <strong>Synonyms:</strong> {word.synonyms}
              </p>
            ) : null}

            {word.antonyms ? (
              <p>
                <strong>Antonyms:</strong> {word.antonyms}
              </p>
            ) : null}

            {word.example ? (
              <p>
                <strong>Example:</strong> {word.example}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
