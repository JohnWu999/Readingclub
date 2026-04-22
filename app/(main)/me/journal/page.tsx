"use client";

import { ArrowLeft, Heart, Plus } from "lucide-react";
import Link from "next/link";

const journals = [
  { date: "4月20日", mood: "平静", content: "今天读了第三章，安心老师说的「不越界」让我很有触动。" },
  { date: "4月18日", mood: "感恩", content: "孩子今天主动和我分享了学校的事，感觉关系近了一步。" },
  { date: "4月15日", mood: "觉察", content: "发现自己经常在无意识中想控制孩子，需要时刻提醒自己。" },
];

export default function JournalPage() {
  return (
    <main className="px-5 pt-6 pb-8">
      {/* 顶部栏 */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/me" className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-[#C9A961]/15">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <h1 className="text-lg font-bold text-[#2D2D2D]">情绪日记</h1>
      </div>

      {/* 新建按钮 */}
      <button className="w-full py-3 rounded-xl bg-[#E85D04] text-white text-sm font-medium flex items-center justify-center gap-2 mb-6">
        <Plus size={18} />
        记录今日心境
      </button>

      {/* 日记列表 */}
      <div className="space-y-3">
        {journals.map((j, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-[#C9A961]/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-400">{j.date}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#C9A961]">{j.mood}</span>
            </div>
            <p className="text-sm text-[#2D2D2D] leading-relaxed">{j.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
