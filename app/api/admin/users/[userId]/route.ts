import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type UpdateUserRequestBody = {
  name?: string | null;
  role?: "ADMIN" | "USER";
  isActive?: boolean;
  password?: string;
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await context.params;
    const body = (await request.json()) as UpdateUserRequestBody;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userId === session.user.id && body.isActive === false) {
      return NextResponse.json(
        { error: "You cannot deactivate your own admin account" },
        { status: 400 }
      );
    }

    if (userId === session.user.id && body.role === "USER") {
      return NextResponse.json(
        { error: "You cannot remove your own admin role" },
        { status: 400 }
      );
    }

    const data: {
      name?: string | null;
      role?: "ADMIN" | "USER";
      isActive?: boolean;
      passwordHash?: string;
    } = {};

    if ("name" in body) {
      data.name = body.name?.trim() || null;
    }

    if (body.role) {
      data.role = body.role;
    }

    if (typeof body.isActive === "boolean") {
      data.isActive = body.isActive;
    }

    if (body.password) {
      if (body.password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }

      data.passwordHash = await bcrypt.hash(body.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

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
    console.error("Update user API error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
