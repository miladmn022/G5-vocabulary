import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import DashboardHeader from "@/components/dashboard-header";
import StatCard from "@/components/stat-card";
import StartLearningCard from "@/components/start-learning-card";
import BottomNav from "@/components/bottom-nav";
import { getSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <AppShell>
      <DashboardHeader />

      <StartLearningCard />

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
          value="10"
        />

        <StatCard
          title="Learned"
          value="8"
        />

        <StatCard
          title="Streak"
          value="5 🔥"
        />

        <StatCard
          title="Total Words"
          value="240"
        />
      </div>

      <BottomNav />
    </AppShell>
  );
}
