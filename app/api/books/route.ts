import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const books = await prisma.book.findMany({
      where: { isPublished: true },
      orderBy: [{ isActive: "desc" }, { order: "asc" }],
      include: {
        _count: { select: { chapters: true } },
      },
    });
    return NextResponse.json({ books });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "获取书籍失败" }, { status: 500 });
  }
}
