import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import DailyGoalSelector from "@/components/daily-goal-selector";
import LearningLevelSelector from "@/components/learning-level-selector";
import DeleteAllWordsButton from "@/components/delete-all-words-button";
import { getSession } from "@/lib/session";
import {
  getDashboardWords,
  getWordCounts,
} from "@/lib/dashboard-words";
import { prisma } from "@/lib/prisma";

type WordsPageProps = {
  searchParams: Promise<{
    scope?: string;
    q?: string;
  }>;
};

export default async function WordsPage({
  searchParams,
}: WordsPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const scope = params.scope === "personal" ? "personal" : "global";
  const query = params.q?.trim() || "";

  const userPreferences = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      dailyGoal: true,
      learningLevel: true,
    },
  });

  const learningLevel =
    userPreferences?.learningLevel === "BEGINNER" ||
    userPreferences?.learningLevel === "INTERMEDIATE" ||
    userPreferences?.learningLevel === "ADVANCED"
      ? userPreferences.learningLevel
      : "INTERMEDIATE";

  const [words, counts] = await Promise.all([
    getDashboardWords({
      userId: session.user.id,
      scope,
      query,
      take: 60,
      learningLevel,
    }),
    getWordCounts(session.user.id),
  ]);

  return (
    <AppShell>
      <div className="py-6">
        <p className="text-sm text-gray-500">Vocabulary</p>
        <h1 className="text-2xl font-bold">Words</h1>
        <p className="mt-2 text-gray-500">
          Switch between global words and your personal words.
        </p>
      </div>

      <DailyGoalSelector dailyGoal={userPreferences?.dailyGoal || 20} />

      <LearningLevelSelector learningLevel={learningLevel} />

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link
          href={`/words?scope=global${query ? `&q=${encodeURIComponent(query)}` : ""}`}
          className={`
            rounded-2xl
            border
            p-4
            text-center
            text-sm
            font-medium
            ${
              scope === "global"
                ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                : "border-gray-100 bg-white text-gray-600"
            }
          `}
        >
          Global words
          <span className="mt-1 block text-xs">
            {counts.globalWordsCount}
          </span>
        </Link>

        <Link
          href={`/words?scope=personal${query ? `&q=${encodeURIComponent(query)}` : ""}`}
          className={`
            rounded-2xl
            border
            p-4
            text-center
            text-sm
            font-medium
            ${
              scope === "personal"
                ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                : "border-gray-100 bg-white text-gray-600"
            }
          `}
        >
          My words
          <span className="mt-1 block text-xs">
            {counts.personalWordsCount}
          </span>
        </Link>
      </div>

      <DeleteAllWordsButton
        scope={scope}
        canDelete={scope === "personal" || session.user.role === "ADMIN"}
      />

      <form
        action="/words"
        className="
          mt-5
          rounded-3xl
          border
          border-gray-100
          bg-white
          p-4
          shadow-sm
        "
      >
        <input type="hidden" name="scope" value={scope} />

        <input
          name="q"
          defaultValue={query}
          placeholder="Search English or Persian..."
          className="
            w-full
            rounded-2xl
            border
            border-gray-200
            px-4
            py-3
            text-sm
            outline-none
            focus:ring-2
            focus:ring-indigo-500
          "
        />

        <button
          type="submit"
          className="
            mt-3
            w-full
            rounded-2xl
            bg-indigo-600
            px-4
            py-3
            text-sm
            font-medium
            text-white
            hover:bg-indigo-700
          "
        >
          Search
        </button>
      </form>

      <div
        className="
          mt-5
          grid
          grid-cols-2
          gap-3
          sm:grid-cols-3
        "
      >
        {words.length === 0 ? (
          <p className="col-span-2 rounded-3xl bg-white p-5 text-sm text-gray-500 sm:col-span-3">
            No words found.
          </p>
        ) : (
          words.map((word) => (
            <div
              key={word.id}
              className="
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-4
                shadow-sm
              "
            >
              <p className="font-bold text-gray-900">
                {word.text}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {word.meaning}
              </p>

              <Link
                href={`/words/${word.id}`}
                className="
                  mt-3
                  inline-flex
                  rounded-full
                  bg-slate-100
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-gray-600
                  hover:bg-indigo-50
                  hover:text-indigo-700
                "
              >
                Edit
              </Link>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}
