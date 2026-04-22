import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { order: "asc" },
          include: {
            audioFiles: { orderBy: { order: "asc" } },
            materials: { orderBy: { order: "asc" } },
          },
        },
        materials: { orderBy: { order: "asc" } },
      },
    });

    if (!book) {
      return NextResponse.json({ error: "书籍不存在" }, { status: 404 });
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "获取书籍详情失败" }, { status: 500 });
  }
}
