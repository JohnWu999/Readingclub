import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE /api/mood-records/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("x-user-id");
    if (!authHeader) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const { id } = await params;

    // 确保只能删除自己的记录
    const existing = await prisma.emotionJournal.findFirst({
      where: { id, userId: authHeader },
    });

    if (!existing) {
      return NextResponse.json({ error: "记录不存在" }, { status: 404 });
    }

    await prisma.emotionJournal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除情绪记录失败:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
