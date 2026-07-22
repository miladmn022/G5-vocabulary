import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import AdminWordForm from "@/components/admin-word-form";
import { getSession } from "@/lib/session";

export default async function AdminWordsPage() {
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
        <h1 className="text-2xl font-bold">Add new word</h1>
        <p className="mt-2 text-gray-500">
          Add a vocabulary item and make it available for active users.
        </p>
      </div>

      <AdminWordForm />
    </AppShell>
  );
}
