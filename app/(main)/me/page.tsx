"use client";

import { useState, useEffect } from "react";
import { ChevronRight, BookOpen, Heart, Award, Settings, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  phone: string;
  nickname: string;
  avatar: string | null;
  role: string;
}

export default function MePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("未登录");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    fetch("/api/auth/logout", { method: "POST" })
      .then(() => {
        router.push("/login");
      })
      .catch(() => {
        router.push("/login");
      });
  };

  if (loading) {
    return (
      <main className="px-5 pt-6 pb-8">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-200 rounded-2xl" />
          <div className="h-16 bg-gray-200 rounded-xl" />
          <div className="h-16 bg-gray-200 rounded-xl" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="px-5 pt-6 pb-8">
        <div className="bg-white rounded-2xl p-8 border border-[#C9A961]/15 text-center">
          <p className="text-sm text-gray-500 mb-4">请先登录</p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 rounded-xl bg-[#E85D04] text-white text-sm font-medium"
          >
            去登录
          </Link>
        </div>
      </main>
    );
  }

  const menuItems = [
    { label: "我的困惑", href: "/onboarding", icon: Sparkles, desc: "编辑育儿困惑与孩子情况" },
    { label: "学习进度", href: "/me/progress", icon: BookOpen, desc: "已完成 0%" },
    { label: "打卡日历", href: "/me/checkin", icon: Award, desc: "查看详情" },
    { label: "情绪日记", href: "/me/journal", icon: Heart, desc: "记录心情" },
    { label: "设置", href: "/me/settings", icon: Settings, desc: "" },
  ];

  const maskPhone = (phone: string) => phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");

  return (
    <main className="px-5 pt-6 pb-8">
      {/* 用户卡片 */}
      <div className="bg-white rounded-2xl p-5 border border-[#C9A961]/15 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E85D04] to-[#C9A961] flex items-center justify-center text-white text-xl font-bold">
            {user.nickname?.[0] || "用"}
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#2D2D2D]">{user.nickname || "书友"}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{maskPhone(user.phone)}</p>
          </div>
        </div>
      </div>

      {/* 菜单 */}
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-xl p-4 flex items-center justify-between border border-[#C9A961]/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] flex items-center justify-center">
                <item.icon size={18} className="text-[#C9A961]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#2D2D2D]">{item.label}</p>
                {item.desc && <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>}
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-xl p-4 flex items-center gap-3 border border-[#C9A961]/10 mt-4"
        >
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
            <LogOut size={18} className="text-red-400" />
          </div>
          <span className="text-sm text-red-400">退出登录</span>
        </button>
      </div>
    </main>
  );
}
