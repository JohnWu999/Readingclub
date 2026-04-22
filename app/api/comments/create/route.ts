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

    const { chapterId, content, parentId } = await req.json();

    if (!chapterId || !content?.trim()) {
      return NextResponse.json({ error: "章节ID和内容不能为空" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        userId: payload.userId,
        chapterId,
        content: content.trim(),
        parentId: parentId || null,
      },
      include: {
        user: { select: { id: true, nickname: true, avatar: true } },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "发表失败" }, { status: 500 });
  }
}
