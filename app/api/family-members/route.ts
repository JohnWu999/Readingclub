import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/family-members - 获取当前用户的孩子列表
export async function GET(req: NextRequest) {
  try {
    // 从 cookie 或 header 获取 userId
    const authHeader = req.headers.get("x-user-id");
    const cookieUserId = req.cookies.get("userId")?.value;
    const userId = authHeader || cookieUserId;

    if (!userId) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const members = await prisma.familyMember.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Get family members error:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

// POST /api/family-members - 创建孩子信息
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-user-id");
    const cookieUserId = req.cookies.get("userId")?.value;
    const userId = authHeader || cookieUserId;

    if (!userId) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const body = await req.json();
    const { name, relation, age, grade, interests, currentBook, progress } = body;

    if (!name || !relation) {
      return NextResponse.json({ error: "姓名和关系为必填" }, { status: 400 });
    }

    const member = await prisma.familyMember.create({
      data: {
        userId,
        name,
        relation,
        age: age || null,
        grade: grade || null,
        interests: interests || "",
        currentBook: currentBook || null,
        progress: progress || 0,
      },
    });

    return NextResponse.json({ member });
  } catch (error) {
    console.error("Create family member error:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
