import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import ImportWordsForm from "@/components/import-words-form";
import { getSession } from "@/lib/session";

export default async function ImportPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <AppShell>
      <div className="py-6">
        <p className="text-sm text-gray-500">Vocabulary</p>
        <h1 className="text-2xl font-bold">Import words</h1>
        <p className="mt-2 text-gray-500">
          Add multiple vocabulary items from a CSV file.
        </p>
      </div>

      <ImportWordsForm isAdmin={session.user.role === "ADMIN"} />
    </AppShell>
  );
}
