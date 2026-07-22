import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import DashboardHeader from "@/components/dashboard-header";
import StatCard from "@/components/stat-card";
import StartLearningCard from "@/components/start-learning-card";
import BottomNav from "@/components/bottom-nav";
import LogoutButton from "@/components/logout-button";
import InstallButton from "@/components/install-button";
import DashboardActionGrid from "@/components/dashboard-action-grid";
import { getSession } from "@/lib/session";
import { getDashboardStats } from "@/lib/dashboard-stats";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const stats = await getDashboardStats({
    userId: session.user.id,
  });

  return (
    <AppShell>
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <DashboardHeader
          name={session.user.name}
          email={session.user.email}
        />

        <div className="flex items-center gap-2">
          <InstallButton />
          <LogoutButton />
        </div>
      </div>

      <StartLearningCard />

      <DashboardActionGrid isAdmin={session.user.role === "ADMIN"} />

      <div
        className="
          mt-5
          grid
          grid-cols-2
          gap-4
        "
      >
        <StatCard
          title="Today's Goal"
          value={`${stats.reviewedToday}/${stats.dailyGoal}`}
        />

        <StatCard
          title="Learned"
          value={`${stats.learnedWords}`}
        />

        <StatCard
          title="Due Now"
          value={`${stats.dueWords}`}
        />

        <StatCard
          title="Total Words"
          value={`${stats.totalWords}`}
        />
      </div>

      <BottomNav />
    </AppShell>
  );
}
