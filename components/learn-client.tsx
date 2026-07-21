"use client";

import { useEffect, useState } from "react";
import Flashcard from "@/components/flashcard";
import ReviewButtons from "@/components/review-buttons";

type ReviewRating = "AGAIN" | "HARD" | "GOOD" | "EASY";

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

type NextWordResponse = {
  userWord: UserWord | null;
  message?: string;
  error?: string;
};

export default function LearnClient() {
  const [userWord, setUserWord] = useState<UserWord | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [message, setMessage] = useState("");

  async function loadNextWord() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/learn/next", {
        cache: "no-store",
      });

      const data = (await response.json()) as NextWordResponse;

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

      if (!response.ok) {
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
  }, []);

  if (loading) {
    return (
      <div className="mt-8 rounded-3xl bg-white p-8 text-center text-gray-500 shadow-lg border border-gray-100">
        Loading next word...
      </div>
    );
  }

  if (!userWord) {
    return (
      <div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">All done</h2>
        <p className="mt-3 text-gray-500">{message}</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <Flashcard word={userWord.word} />

      <ReviewButtons
        disabled={reviewing}
        onReview={handleReview}
      />

      {message ? (
        <p className="mt-4 text-center text-sm text-red-500">{message}</p>
      ) : null}
    </div>
  );
}
