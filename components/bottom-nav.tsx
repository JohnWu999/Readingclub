"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BookOpen, Heart, CheckCircle, User, Sparkles, Baby } from "lucide-react";

const tabs = [
  { name: "书架", href: "/", icon: BookOpen },
  { name: "AI共读", href: "/reading-together", icon: Sparkles },
  { name: "孩子", href: "/child", icon: Baby },
  { name: "疗愈", href: "/healing", icon: Heart },
  { name: "我的", href: "/me", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#C9A961]/20 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
                isActive ? "text-[#E85D04]" : "text-gray-400"
              }`}
            >
              <tab.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[11px] font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
