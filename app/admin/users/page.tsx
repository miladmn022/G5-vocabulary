import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import AdminUserForm from "@/components/admin-user-form";
import { getSession } from "@/lib/session";

export default async function AdminUsersPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

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
    </AppShell>
  );
}
