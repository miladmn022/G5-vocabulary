import AppShell from "@/components/app-shell";
import LearningHeader from "@/components/learning-header";
import LearnClient from "@/components/learn-client";

export default function LearnPage() {
  return (
    <AppShell>
      <LearningHeader />
      <LearnClient />
    </AppShell>
  );
}
