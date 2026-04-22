"use client";

import { ArrowLeft, BookOpen, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

const chapters = [
  { title: "第一章 不越界", done: true },
  { title: "第二章 不评判", done: true },
  { title: "第三章 负责任", done: true },
  { title: "第四章 无伤害", done: false },
  { title: "第五章 调整聚焦", done: false },
  { title: "第六章 创建和解", done: false },
];

export default function ProgressPage() {
  const completed = chapters.filter(c => c.done).length;
  const total = chapters.length;
  const percent = Math.round((completed / total) * 100);

  return (
    <main className="px-5 pt-6 pb-8">
      {/* 顶部栏 */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/me" className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-[#C9A961]/15">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <h1 className="text-lg font-bold text-[#2D2D2D]">学习进度</h1>
      </div>

      {/* 进度卡片 */}
      <div className="bg-white rounded-2xl p-5 border border-[#C9A961]/15 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] flex items-center justify-center">
            <BookOpen size={22} className="text-[#C9A961]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">《在远远的背后带领》</p>
            <p className="text-lg font-bold text-[#2D2D2D]">{completed}/{total} 章</p>
          </div>
        </div>
        {/* 进度条 */}
        <div className="h-2 bg-[#FAF7F2] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#E85D04] to-[#C9A961] rounded-full transition-all" style={{ width: `${percent}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-right">已完成 {percent}%</p>
      </div>

      {/* 章节列表 */}
      <div className="space-y-2">
        {chapters.map((ch, i) => (
          <div key={i} className="bg-white rounded-xl p-4 flex items-center justify-between border border-[#C9A961]/10">
            <span className="text-sm text-[#2D2D2D]">{ch.title}</span>
            {ch.done ? (
              <CheckCircle2 size={20} className="text-[#C9A961]" />
            ) : (
              <Circle size={20} className="text-gray-200" />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
