import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "登录已过期" }, { status: 401 });
    }

    const { type, chapterId, content } = await req.json();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.checkIn.findUnique({
      where: {
        userId_type_createdAt: {
          userId: payload.userId,
          type: type || "READING",
          createdAt: today,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "今天已打卡" }, { status: 409 });
    }

    const checkIn = await prisma.checkIn.create({
      data: {
        userId: payload.userId,
        type: type || "READING",
        chapterId: chapterId || null,
        content: content || null,
      },
    });

    return NextResponse.json({ checkIn }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "打卡失败" }, { status: 500 });
  }
}
