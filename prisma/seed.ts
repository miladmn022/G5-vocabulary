import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: "demo@g5.local",
    },
    update: {},
    create: {
      email: "demo@g5.local",
      name: "Demo User",
    },
  });

  const words = [
    {
      text: "Apple",
      meaning: "سیب",
      synonyms: "fruit",
      antonyms: "",
      example: "I eat an apple every day.",
      level: 0,
    },
    {
      text: "Brave",
      meaning: "شجاع",
      synonyms: "courageous, bold",
      antonyms: "cowardly",
      example: "She was brave during the storm.",
      level: 1,
    },
    {
      text: "Improve",
      meaning: "بهبود دادن / بهتر شدن",
      synonyms: "enhance, develop",
      antonyms: "worsen",
      example: "You can improve your vocabulary with daily practice.",
      level: 1,
    },
    {
      text: "Memory",
      meaning: "حافظه",
      synonyms: "recall, remembrance",
      antonyms: "forgetfulness",
      example: "Flashcards help strengthen memory.",
      level: 2,
    },
    {
      text: "Consistent",
      meaning: "ثابت‌قدم / مداوم",
      synonyms: "steady, regular",
      antonyms: "inconsistent",
      example: "Consistent practice creates strong results.",
      level: 2,
    },
  ];

  for (const word of words) {
    const createdWord = await prisma.word.upsert({
      where: {
        text: word.text,
      },
      update: {
        meaning: word.meaning,
        synonyms: word.synonyms,
        antonyms: word.antonyms,
        example: word.example,
        level: word.level,
      },
      create: word,
    });

    await prisma.userWord.upsert({
      where: {
        userId_wordId: {
          userId: user.id,
          wordId: createdWord.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        wordId: createdWord.id,
        g5Level: 0,
        easeFactor: 2.5,
        interval: 0,
        nextReviewAt: new Date(),
      },
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
