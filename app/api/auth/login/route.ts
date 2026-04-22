import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ error: "手机号和密码不能为空" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return NextResponse.json({ error: "手机号或密码错误" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "手机号或密码错误" }, { status: 401 });
    }

    const token = signToken({ userId: user.id, phone: user.phone, role: user.role });

    return NextResponse.json(
      { user: { id: user.id, phone: user.phone, nickname: user.nickname, role: user.role } },
      { headers: { "Set-Cookie": setAuthCookie(token) } }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "登录失败" }, { status: 500 });
  }
}
