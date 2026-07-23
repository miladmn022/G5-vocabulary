import { prisma } from "@/lib/prisma";

type WordScope = "global" | "personal";
type LearningLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

type GetDashboardWordsInput = {
  userId: string;
  scope: WordScope;
  query?: string;
  take?: number;
  learningLevel?: LearningLevel;
};

function getLevelValue(learningLevel?: LearningLevel) {
  if (learningLevel === "BEGINNER") {
    return 1;
  }

  if (learningLevel === "ADVANCED") {
    return 3;
  }

  return 2;
}

function getWhere({
  userId,
  scope,
  query,
  learningLevel,
}: {
  userId: string;
  scope: WordScope;
  query?: string;
  learningLevel?: LearningLevel;
}) {
  const scopeWhere =
    scope === "global"
      ? {
          isGlobal: true,
          level: getLevelValue(learningLevel),
        }
      : {
          isGlobal: false,
          createdByUserId: userId,
        };

  const search = query?.trim();

  if (!search) {
    return scopeWhere;
  }

  return {
    AND: [
      scopeWhere,
      {
        OR: [
          {
            text: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            meaning: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      },
    ],
  };
}

export async function getDashboardWords({
  userId,
  scope,
  query,
  take = 12,
  learningLevel,
}: GetDashboardWordsInput) {
  const words = await prisma.word.findMany({
    where: getWhere({
      userId,
      scope,
      query,
      learningLevel,
    }),
    orderBy: {
      createdAt: "desc",
    },
    take,
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

  return words;
}

export async function getWordCounts(userId: string) {
  const [
    globalWordsCount,
    personalWordsCount,
    myLearningWordsCount,
    assignedGlobalWordsCount,
  ] = await Promise.all([
    prisma.word.count({
      where: {
        isGlobal: true,
      },
    }),

    prisma.word.count({
      where: {
        isGlobal: false,
        createdByUserId: userId,
      },
    }),

    prisma.userWord.count({
      where: {
        userId,
      },
    }),

    prisma.userWord.count({
      where: {
        userId,
        word: {
          isGlobal: true,
        },
      },
    }),
  ]);

  return {
    globalWordsCount,
    personalWordsCount,
    myLearningWordsCount,
    assignedGlobalWordsCount,
  };
}
