import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import LearnClient from "@/components/learn-client";
import { getSession } from "@/lib/session";

type LearnPageProps = {
  searchParams: Promise<{
    scope?: string;
  }>;
};

export default async function LearnPage({
  searchParams,
}: LearnPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const scope = params.scope === "personal" ? "personal" : "global";

  return (
    <AppShell>
      <LearnClient scope={scope} />
    </AppShell>
  );
}
