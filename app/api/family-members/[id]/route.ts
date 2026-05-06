import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE /api/family-members/[id] - 删除孩子信息
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("x-user-id");
    const cookieUserId = req.cookies.get("userId")?.value;
    const userId = authHeader || cookieUserId;

    if (!userId) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const { id } = await params;

    // 确认这是当前用户的孩子
    const member = await prisma.familyMember.findFirst({
      where: { id, userId },
    });

    if (!member) {
      return NextResponse.json({ error: "未找到" }, { status: 404 });
    }

    await prisma.familyMember.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete family member error:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}

// PATCH /api/family-members/[id] - 更新孩子信息
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("x-user-id");
    const cookieUserId = req.cookies.get("userId")?.value;
    const userId = authHeader || cookieUserId;

    if (!userId) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const member = await prisma.familyMember.findFirst({
      where: { id, userId },
    });

    if (!member) {
      return NextResponse.json({ error: "未找到" }, { status: 404 });
    }

    const updated = await prisma.familyMember.update({
      where: { id },
      data: {
        name: body.name,
        relation: body.relation,
        age: body.age,
        grade: body.grade,
        interests: body.interests,
        currentBook: body.currentBook,
        progress: body.progress,
      },
    });

    return NextResponse.json({ member: updated });
  } catch (error) {
    console.error("Update family member error:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
