import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type LearningLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

type UpdatePreferencesRequestBody = {
  dailyGoal?: number;
  learningLevel?: LearningLevel;
};

const allowedDailyGoals = [10, 20, 30, 40, 50];
const allowedLearningLevels: LearningLevel[] = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
];

export async function PATCH(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as UpdatePreferencesRequestBody;

    const data: {
      dailyGoal?: number;
      learningLevel?: LearningLevel;
    } = {};

    if (typeof body.dailyGoal !== "undefined") {
      if (
        typeof body.dailyGoal !== "number" ||
        !allowedDailyGoals.includes(body.dailyGoal)
      ) {
        return NextResponse.json(
          { error: "Invalid daily goal" },
          { status: 400 }
        );
      }

      data.dailyGoal = body.dailyGoal;
    }

    if (typeof body.learningLevel !== "undefined") {
      if (!allowedLearningLevels.includes(body.learningLevel)) {
        return NextResponse.json(
          { error: "Invalid learning level" },
          { status: 400 }
        );
      }

      data.learningLevel = body.learningLevel;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No preferences provided" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data,
      select: {
        id: true,
        dailyGoal: true,
        learningLevel: true,
      },
    });

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error("Update preferences API error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
