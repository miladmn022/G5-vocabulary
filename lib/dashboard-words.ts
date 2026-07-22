import { prisma } from "@/lib/prisma";

type GetDashboardWordsInput = {
  userId: string;
  scope: "global" | "personal";
};

export async function getDashboardWords({
  userId,
  scope,
}: GetDashboardWordsInput) {
  const words = await prisma.word.findMany({
    where:
      scope === "global"
        ? {
            isGlobal: true,
          }
        : {
            isGlobal: false,
            createdByUserId: userId,
          },
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
    select: {
      id: true,
      text: true,
      meaning: true,
      isGlobal: true,
    },
  });

  return words;
}
