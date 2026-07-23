import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import AdminLinks from "@/components/admin-links";
import AdminWordForm from "@/components/admin-word-form";
import AdminWordList from "@/components/admin-word-list";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function AdminWordsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "ADMIN";

  const words = await prisma.word.findMany({
    where: isAdmin
      ? {
          isGlobal: true,
        }
      : {
          isGlobal: false,
          createdByUserId: session.user.id,
        },
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
        <p className="text-sm text-gray-500">
          {isAdmin ? "Admin" : "Words"}
        </p>

        <h1 className="text-2xl font-bold">
          Manage words
        </h1>

        <p className="mt-2 text-gray-500">
          {isAdmin
            ? "Add global vocabulary words for all active users."
            : "Add personal vocabulary words to your own learning list."}
        </p>
      </div>

      {isAdmin ? <AdminLinks /> : null}

      <AdminWordForm />

      <AdminWordList words={words} />
    </AppShell>
  );
}
