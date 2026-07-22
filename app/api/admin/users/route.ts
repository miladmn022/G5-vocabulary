import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type CreateUserRequestBody = {
  email?: string;
  name?: string;
  password?: string;
  role?: "ADMIN" | "USER";
};

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as CreateUserRequestBody;

    const email = body.email?.trim().toLowerCase();
    const name = body.name?.trim() || null;
    const password = body.password;
    const role = body.role || "USER";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role,
        isActive: true,
      },
    });

    const words = await prisma.word.findMany({
      select: {
        id: true,
      },
    });

    await Promise.all(
      words.map((word) =>
        prisma.userWord.create({
          data: {
            userId: user.id,
            wordId: word.id,
            g5Level: 0,
            easeFactor: 2.5,
            interval: 0,
            nextReviewAt: new Date(),
          },
        })
      )
    );

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Create user API error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
