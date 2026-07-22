import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type BulkDeleteRequestBody = {
  scope?: "global" | "personal";
};

export async function DELETE(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as BulkDeleteRequestBody;
    const scope = body.scope === "global" ? "global" : "personal";

    if (scope === "global" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can delete global words" },
        { status: 403 }
      );
    }

    const wordWhere =
      scope === "global"
        ? {
            isGlobal: true,
          }
        : {
            isGlobal: false,
            createdByUserId: session.user.id,
          };

    const words = await prisma.word.findMany({
      where: wordWhere,
      select: {
        id: true,
      },
    });

    const wordIds = words.map((word) => word.id);

    if (wordIds.length === 0) {
      return NextResponse.json({
        deletedCount: 0,
        scope,
      });
    }

    await prisma.$transaction([
      prisma.reviewHistory.deleteMany({
        where: {
          wordId: {
            in: wordIds,
          },
        },
      }),
      prisma.userWord.deleteMany({
        where: {
          wordId: {
            in: wordIds,
          },
        },
      }),
      prisma.word.deleteMany({
        where: {
          id: {
            in: wordIds,
          },
        },
      }),
    ]);

    return NextResponse.json({
      deletedCount: wordIds.length,
      scope,
    });
  } catch (error) {
    console.error("Bulk delete words API error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
