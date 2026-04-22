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

    const { audioId, position, isCompleted } = await req.json();

    if (!audioId || position === undefined) {
      return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }

    const progress = await prisma.audioProgress.upsert({
      where: {
        userId_audioId: {
          userId: payload.userId,
          audioId,
        },
      },
      update: {
        position,
        isCompleted: isCompleted || false,
      },
      create: {
        userId: payload.userId,
        audioId,
        position,
        isCompleted: isCompleted || false,
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "保存进度失败" }, { status: 500 });
  }
}
