import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get("chapterId");
    const bookId = searchParams.get("bookId");

    let chapterIds: string[] = [];

    if (chapterId) {
      chapterIds = [chapterId];
    } else if (bookId) {
      const chapters = await prisma.chapter.findMany({
        where: { bookId },
        select: { id: true },
      });
      chapterIds = chapters.map((c) => c.id);
    }

    if (chapterIds.length === 0) {
      return NextResponse.json({ comments: [] });
    }

    const comments = await prisma.comment.findMany({
      where: { chapterId: { in: chapterIds }, parentId: null },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      include: {
        user: { select: { id: true, nickname: true, avatar: true } },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            user: { select: { id: true, nickname: true, avatar: true } },
          },
        },
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "获取评论失败" }, { status: 500 });
  }
}
