import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        book: { select: { id: true, title: true } },
        audioFiles: { orderBy: { order: "asc" } },
        materials: { orderBy: { order: "asc" } },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, nickname: true, avatar: true } },
            replies: {
              include: {
                user: { select: { id: true, nickname: true, avatar: true } },
              },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "章节不存在" }, { status: 404 });
    }

    return NextResponse.json({ chapter });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "获取章节详情失败" }, { status: 500 });
  }
}
