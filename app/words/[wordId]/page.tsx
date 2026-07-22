import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import WordEditor from "@/components/word-editor";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

type WordEditPageProps = {
  params: Promise<{
    wordId: string;
  }>;
};

export default async function WordEditPage({
  params,
}: WordEditPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { wordId } = await params;

  const word = await prisma.word.findUnique({
    where: {
      id: wordId,
    },
    select: {
      id: true,
      text: true,
      meaning: true,
      synonyms: true,
      antonyms: true,
      example: true,
      level: true,
      isGlobal: true,
      createdByUserId: true,
    },
  });

  if (!word) {
    redirect("/words");
  }

  const isAdmin = session.user.role === "ADMIN";
  const canEdit =
    (word.isGlobal && isAdmin) ||
    (!word.isGlobal &&
      (word.createdByUserId === session.user.id || isAdmin));

  if (!canEdit) {
    redirect("/words");
  }

  return (
    <AppShell>
      <div className="py-6">
        <p className="text-sm text-gray-500">Vocabulary</p>
        <h1 className="text-2xl font-bold">Edit word</h1>
        <p className="mt-2 text-gray-500">
          Update or delete this vocabulary item.
        </p>
      </div>

      <WordEditor word={word} />
    </AppShell>
  );
}
