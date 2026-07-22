import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type UpdatePreferencesRequestBody = {
  dailyGoal?: number;
};

const allowedDailyGoals = [10, 20, 30, 40, 50];

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

    if (
      typeof body.dailyGoal !== "number" ||
      !allowedDailyGoals.includes(body.dailyGoal)
    ) {
      return NextResponse.json(
        { error: "Invalid daily goal" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        dailyGoal: body.dailyGoal,
      },
      select: {
        id: true,
        dailyGoal: true,
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
