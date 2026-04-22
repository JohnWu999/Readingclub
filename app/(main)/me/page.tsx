"use client";

import { ChevronRight, BookOpen, Heart, Award, Settings, LogOut } from "lucide-react";
import Link from "next/link";

const menuItems = [
  { label: "学习进度", href: "/me/progress", icon: BookOpen, desc: "已完成 35%" },
  { label: "打卡日历", href: "/me/checkin", icon: Award, desc: "连续 7 天" },
  { label: "情绪日记", href: "/me/journal", icon: Heart, desc: "3 条日记" },
  { label: "设置", href: "/me/settings", icon: Settings, desc: "" },
];

export default function MePage() {
  return (
    <main className="px-5 pt-6 pb-8">
      {/* 用户卡片 */}
      <div className="bg-white rounded-2xl p-5 border border-[#C9A961]/15 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E85D04] to-[#C9A961] flex items-center justify-center text-white text-xl font-bold">
            犁
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#2D2D2D]">犁爸会员</h1>
            <p className="text-xs text-gray-400 mt-0.5">138****8888</p>
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

        <button className="w-full bg-white rounded-xl p-4 flex items-center gap-3 border border-[#C9A961]/10 mt-4">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
            <LogOut size={18} className="text-red-400" />
          </div>
          <span className="text-sm text-red-400">退出登录</span>
        </button>
      </div>
    </main>
  );
}
