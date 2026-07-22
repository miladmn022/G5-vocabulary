import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type RouteContext = {
  params: Promise<{
    wordId: string;
  }>;
};

type UpdateWordRequestBody = {
  text?: string;
  meaning?: string;
  synonyms?: string | null;
  antonyms?: string | null;
  example?: string | null;
  level?: number;
};

async function getWordPermission(wordId: string) {
  const session = await getSession();

  if (!session) {
    return {
      allowed: false,
      status: 401,
      error: "Unauthorized",
      session: null,
      word: null,
    };
  }

  const word = await prisma.word.findUnique({
    where: {
      id: wordId,
    },
  });

  if (!word) {
    return {
      allowed: false,
      status: 404,
      error: "Word not found",
      session,
      word: null,
    };
  }

  const isAdmin = session.user.role === "ADMIN";
  const ownsWord = word.createdByUserId === session.user.id;

  if (word.isGlobal && !isAdmin) {
    return {
      allowed: false,
      status: 403,
      error: "Only admins can edit global words",
      session,
      word,
    };
  }

  if (!word.isGlobal && !ownsWord && !isAdmin) {
    return {
      allowed: false,
      status: 403,
      error: "You can only edit your own words",
      session,
      word,
    };
  }

  return {
    allowed: true,
    status: 200,
    error: "",
    session,
    word,
  };
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { wordId } = await context.params;
    const permission = await getWordPermission(wordId);

    if (!permission.allowed) {
      return NextResponse.json(
        { error: permission.error },
        { status: permission.status }
      );
    }

    const body = (await request.json()) as UpdateWordRequestBody;

    if (!body.text?.trim() || !body.meaning?.trim()) {
      return NextResponse.json(
        { error: "Text and meaning are required" },
        { status: 400 }
      );
    }

    const level = Number.isFinite(Number(body.level))
      ? Math.max(1, Math.min(3, Number(body.level)))
      : 1;

    const updatedWord = await prisma.word.update({
      where: {
        id: wordId,
      },
      data: {
        text: body.text.trim(),
        meaning: body.meaning.trim(),
        synonyms: body.synonyms?.trim() || "",
        antonyms: body.antonyms?.trim() || "",
        example: body.example?.trim() || "",
        level,
      },
    });

    return NextResponse.json({
      word: updatedWord,
    });
  } catch (error) {
    console.error("Update word API error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { wordId } = await context.params;
    const permission = await getWordPermission(wordId);

    if (!permission.allowed) {
      return NextResponse.json(
        { error: permission.error },
        { status: permission.status }
      );
    }

    await prisma.$transaction([
      prisma.reviewHistory.deleteMany({
        where: {
          wordId,
        },
      }),
      prisma.userWord.deleteMany({
        where: {
          wordId,
        },
      }),
      prisma.word.delete({
        where: {
          id: wordId,
        },
      }),
    ]);

    return NextResponse.json({
      deleted: true,
    });
  } catch (error) {
    console.error("Delete word API error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
