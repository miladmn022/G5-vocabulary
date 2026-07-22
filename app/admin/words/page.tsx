import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import AdminWordForm from "@/components/admin-word-form";
import AdminWordList from "@/components/admin-word-list";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function AdminWordsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const words = await prisma.word.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    select: {
      id: true,
      text: true,
      meaning: true,
      isGlobal: true,
      source: true,
      level: true,
      createdAt: true,
    },
  });

  return (
    <AppShell>
      <div className="py-6">
        <p className="text-sm text-gray-500">Admin</p>
        <h1 className="text-2xl font-bold">Add new word</h1>
        <p className="mt-2 text-gray-500">
          Add a vocabulary item and make it available for active users.
        </p>
      </div>

      <AdminWordForm />

      <AdminWordList words={words} />
    </AppShell>
  );
}
