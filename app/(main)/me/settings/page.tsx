"use client";

import { ArrowLeft, Bell, Moon, Shield, FileText } from "lucide-react";
import Link from "next/link";

const settingsItems = [
  { label: "接收通知", icon: Bell, desc: "开启" },
  { label: "暗色模式", icon: Moon, desc: "关闭" },
  { label: "隐私设置", icon: Shield, desc: "" },
  { label: "用户协议", icon: FileText, desc: "" },
];

export default function SettingsPage() {
  return (
    <main className="px-5 pt-6 pb-8">
      {/* 顶部栏 */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/me" className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-[#C9A961]/15">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <h1 className="text-lg font-bold text-[#2D2D2D]">设置</h1>
      </div>

      {/* 设置列表 */}
      <div className="space-y-2">
        {settingsItems.map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-4 flex items-center justify-between border border-[#C9A961]/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] flex items-center justify-center">
                <item.icon size={18} className="text-[#C9A961]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#2D2D2D]">{item.label}</p>
                {item.desc && <p className="text-xs text-gray-400">{item.desc}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center mt-8">犟爸书房 v1.0 · 读书 · 阅己</p>
    </main>
  );
}
