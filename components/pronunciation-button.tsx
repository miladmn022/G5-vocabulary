"use client";

import { Volume2 } from "lucide-react";
import { useState } from "react";

type PronunciationButtonProps = {
  text: string;
  lang?: string;
};

export default function PronunciationButton({
  text,
  lang = "en-US",
}: PronunciationButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const [unsupported, setUnsupported] = useState(false);

  function speak(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setUnsupported(true);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.72;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setSpeaking(true);
      setUnsupported(false);
    };

    utterance.onend = () => {
      setSpeaking(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
      setUnsupported(true);
    };

    window.speechSynthesis.cancel();

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={speak}
        aria-label="Play pronunciation"
        title="Play pronunciation"
        className={`
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          shadow-sm
          transition
          ${
            speaking
              ? "border-indigo-200 bg-indigo-600 text-white"
              : "border-indigo-100 bg-white text-indigo-600 hover:bg-indigo-50"
          }
        `}
      >
        <Volume2 className="h-5 w-5" />
      </button>

      {unsupported ? (
        <span className="text-[10px] text-rose-500">
          Not supported
        </span>
      ) : null}
    </div>
  );
}
