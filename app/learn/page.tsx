import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import LearningHeader from "@/components/learning-header";
import LearnClient from "@/components/learn-client";
import { getSession } from "@/lib/session";

export default async function LearnPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <AppShell>
      <LearningHeader />
      <LearnClient />
    </AppShell>
  );
}
