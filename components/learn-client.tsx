"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Flashcard from "@/components/flashcard";
import LearningHeader from "@/components/learning-header";
import ReviewButtons from "@/components/review-buttons";

type ReviewRating = "AGAIN" | "HARD" | "GOOD" | "EASY";
type LearnScope = "global" | "personal";

type LearnClientProps = {
  scope: LearnScope;
};

type LearnWord = {
  id: string;
  text: string;
  meaning: string;
  synonyms: string | null;
  antonyms: string | null;
  example: string | null;
  level: number;
};

type UserWord = {
  id: string;
  g5Level: number;
  interval: number;
  reviewCount: number;
  correctCount: number;
  wrongCount: number;
  nextReviewAt: string;
  word: LearnWord;
};

type LearnProgress = {
  current: number;
  total: number;
  reviewedInWindow: number;
  remaining: number;
  resetAt: string;
};

type NextWordResponse = {
  userWord: UserWord | null;
  progress?: LearnProgress;
  limitReached?: boolean;
  message?: string;
  error?: string;
};

function formatResetTime(value?: string) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });
}

export default function LearnClient({ scope }: LearnClientProps) {
  const [userWord, setUserWord] = useState<UserWord | null>(null);
  const [progress, setProgress] = useState<LearnProgress | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [message, setMessage] = useState("");

  async function loadNextWord() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/learn/next?scope=${scope}`, {
        cache: "no-store",
      });

      const data = (await response.json()) as NextWordResponse;

      setProgress(data.progress || null);
      setLimitReached(Boolean(data.limitReached));

      if (!response.ok) {
        setUserWord(null);
        setMessage(data.error || "Could not load next word.");
        return;
      }

      setUserWord(data.userWord);

      if (!data.userWord) {
        setMessage(data.message || "No words ready for review.");
      }
    } catch {
      setUserWord(null);
      setMessage("Could not connect to learning API.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(rating: ReviewRating) {
    if (!userWord) return;

    setReviewing(true);
    setMessage("");

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userWordId: userWord.id,
          rating,
        }),
      });

      const data = await response.json();

      if (data.progress) {
        setProgress(data.progress);
      }

      if (!response.ok) {
        setLimitReached(Boolean(data.limitReached));
        setUserWord(null);
        setMessage(data.error || "Could not save review.");
        return;
      }

      await loadNextWord();
    } catch {
      setMessage("Could not submit review.");
    } finally {
      setReviewing(false);
    }
  }

  useEffect(() => {
    loadNextWord();
  }, [scope]);

  const scopeLabel = scope === "personal" ? "Personal words" : "Global words";

  if (loading) {
    return (
      <>
        <LearningHeader
          current={progress?.current || 1}
          total={progress?.total || 10}
        />

        <div className="rounded-full bg-slate-100 px-4 py-2 text-center text-xs font-medium text-gray-600">
          Practicing: {scopeLabel}
        </div>

        <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-8 text-center text-gray-500 shadow-lg">
          Loading next word...
        </div>
      </>
    );
  }

  if (!userWord) {
    return (
      <>
        <LearningHeader
          current={progress?.current || 0}
          total={progress?.total || 0}
        />

        <div className="rounded-full bg-slate-100 px-4 py-2 text-center text-xs font-medium text-gray-600">
          Practicing: {scopeLabel}
        </div>

        <div
          className="
            mt-8
            rounded-3xl
            border
            border-gray-100
            bg-white
            p-8
            text-center
            shadow-lg
          "
        >
          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-emerald-50
              text-3xl
            "
          >
            ✅
          </div>

          <h2
            className="
              mt-5
              text-2xl
              font-bold
              text-gray-900
            "
          >
            {limitReached ? "Daily goal completed" : "All reviews done"}
          </h2>

          <p
            className="
              mt-3
              text-gray-500
            "
          >
            {message || "You have no words ready for review right now."}
          </p>

          {limitReached ? (
            <p
              className="
                mt-2
                text-sm
                text-gray-400
              "
            >
              Come back after {formatResetTime(progress?.resetAt)} or increase
              your daily goal from Words.
            </p>
          ) : (
            <p
              className="
                mt-2
                text-sm
                text-gray-400
              "
            >
              Try another list or come back later.
            </p>
          )}

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/dashboard"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-indigo-600
                px-4
                py-3
                text-sm
                font-medium
                text-white
                hover:bg-indigo-700
              "
            >
              Back to dashboard
            </Link>

            <Link
              href={scope === "personal" ? "/learn?scope=global" : "/learn?scope=personal"}
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                text-sm
                font-medium
                text-gray-700
                hover:bg-gray-50
              "
            >
              Try {scope === "personal" ? "global" : "personal"} words
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LearningHeader
        current={progress?.current || 1}
        total={progress?.total || 10}
      />

      <div className="rounded-full bg-slate-100 px-4 py-2 text-center text-xs font-medium text-gray-600">
        Practicing: {scopeLabel}
      </div>

      <div className="mt-8">
        <Flashcard word={userWord.word} />

        <ReviewButtons
          disabled={reviewing}
          onReview={handleReview}
        />

        <div
          className="
            mt-4
            rounded-2xl
            bg-slate-50
            px-4
            py-3
            text-center
            text-xs
            text-gray-500
          "
        >
          Again = 3 min · Hard = 6h · Good = later · Easy = learned
        </div>

        {message ? (
          <p className="mt-4 text-center text-sm text-red-500">
            {message}
          </p>
        ) : null}
      </div>
    </>
  );
}
