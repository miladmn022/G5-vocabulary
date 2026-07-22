import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import AdminUserForm from "@/components/admin-user-form";
import AdminUserList from "@/components/admin-user-list";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          userWords: true,
        },
      },
    },
  });

  return (
    <AppShell>
      <div className="py-6">
        <p className="text-sm text-gray-500">Admin</p>
        <h1 className="text-2xl font-bold">Create user</h1>
        <p className="mt-2 text-gray-500">
          Create login access for a new learner.
        </p>
      </div>

      <AdminUserForm />

      <AdminUserList users={users} currentUserId={session.user.id} />
    </AppShell>
  );
}
