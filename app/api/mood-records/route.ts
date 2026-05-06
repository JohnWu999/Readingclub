import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LOCAL_STORAGE_KEY = "reading-club-mood-records";

// GET /api/mood-records
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-user-id");
    if (!authHeader) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const records = await prisma.emotionJournal.findMany({
      where: { userId: authHeader },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error("获取情绪记录失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

// POST /api/mood-records
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-user-id");
    if (!authHeader) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const body = await req.json();
    const { emotion, trigger, action, reflection } = body;

    if (!emotion) {
      return NextResponse.json({ error: "情绪类型不能为空" }, { status: 400 });
    }

    const record = await prisma.emotionJournal.create({
      data: {
        userId: authHeader,
        emotion,
        trigger: trigger || null,
        action: action || null,
        reflection: reflection || null,
      },
    });

    return NextResponse.json({ record });
  } catch (error) {
    console.error("保存情绪记录失败:", error);
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}
