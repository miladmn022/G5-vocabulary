import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import DashboardHeader from "@/components/dashboard-header";
import StatCard from "@/components/stat-card";
import StartLearningCard from "@/components/start-learning-card";
import BottomNav from "@/components/bottom-nav";
import LogoutButton from "@/components/logout-button";
import DashboardActionGrid from "@/components/dashboard-action-grid";
import DashboardWordPreview from "@/components/dashboard-word-preview";
import DailyGoalSelector from "@/components/daily-goal-selector";
import { getSession } from "@/lib/session";
import { getDashboardStats } from "@/lib/dashboard-stats";
import { getDashboardWords, getWordCounts } from "@/lib/dashboard-words";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const stats = await getDashboardStats({
    userId: session.user.id,
  });

  const counts = await getWordCounts(session.user.id);

  const previewScope = session.user.role === "ADMIN" ? "global" : "personal";

  const userPreferences = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      learningLevel: true,
    },
  });

  const learningLevel =
    userPreferences?.learningLevel === "BEGINNER" ||
    userPreferences?.learningLevel === "INTERMEDIATE" ||
    userPreferences?.learningLevel === "ADVANCED"
      ? userPreferences.learningLevel
      : "INTERMEDIATE";

  const previewWords = await getDashboardWords({
    userId: session.user.id,
    scope: previewScope,
    learningLevel,
  });

  return (
    <AppShell showBackButton={false}>
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
          pt-2
        "
      >
        <DashboardHeader
          name={session.user.name}
          email={session.user.email}
        />

        <div className="pt-7">
          <LogoutButton />
        </div>
      </div>

      <StartLearningCard personalWordsCount={counts.personalWordsCount} />

      <DashboardActionGrid isAdmin={session.user.role === "ADMIN"} />

      <DailyGoalSelector dailyGoal={stats.dailyGoal} />

      <DashboardWordPreview
        scope={previewScope}
        words={previewWords}
      />

      <div
        className="
          mt-5
          grid
          grid-cols-2
          gap-4
        "
      >
        <StatCard
          title="Current Goal"
          value={`${stats.reviewedToday}/${stats.dailyGoal}`}
          tone="indigo"
        />

        <StatCard
          title="Learned"
          value={`${stats.learnedWords}`}
          tone="emerald"
        />

        <StatCard
          title="Due Now"
          value={`${stats.dueWords}`}
          tone="amber"
        />

        <StatCard
          title="My Review Items"
          value={`${stats.totalWords}`}
          tone="rose"
        />
      </div>

      <BottomNav />
    </AppShell>
  );
}
