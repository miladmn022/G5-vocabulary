import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import DailyGoalSelector from "@/components/daily-goal-selector";
import { getSession } from "@/lib/session";
import { getDashboardWords } from "@/lib/dashboard-words";
import { prisma } from "@/lib/prisma";

type WordsPageProps = {
  searchParams: Promise<{
    scope?: string;
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

  const [words, userPreferences] = await Promise.all([
    getDashboardWords({
      userId: session.user.id,
      scope,
    }),
    prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        dailyGoal: true,
      },
    }),
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

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link
          href="/words?scope=global"
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
        </Link>

        <Link
          href="/words?scope=personal"
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
        </Link>
      </div>

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
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}
