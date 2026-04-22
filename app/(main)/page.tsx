"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, ChevronRight, Flame } from "lucide-react";

// 临时模拟数据
const currentBook = {
  id: "1",
  title: "在远远的背后带领",
  subtitle: "PET父母效能训练的中国实践",
  author: "安心",
  cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
  progress: 35,
  totalChapters: 15,
  completedChapters: 5,
};

const pastBooks = [
  {
    id: "2",
    title: "父母的语言",
    author: "李珍·海克",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
  },
  {
    id: "3",
    title: "正面管教",
    author: "简·尼尔森",
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=400&fit=crop",
  },
];

const quickActions = [
  { label: "继续阅读", icon: Play, color: "bg-[#E85D04]" },
  { label: "今日打卡", icon: Flame, color: "bg-[#C9A961]" },
];

export default function HomePage() {
  const [streak] = useState(7);

  return (
    <main className="px-5 pt-6 pb-8">
      {/* 顶部标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2D2D2D]">犟爸读书会</h1>
        <p className="text-sm text-gray-500 mt-1">在远远的背后带领</p>
      </div>

      {/* 快捷动作 */}
      <div className="flex gap-3 mb-6">
        {quickActions.map((action) => (
          <button
            key={action.label}
            className={`${action.color} text-white flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm`}
          >
            <action.icon size={16} />
            {action.label}
          </button>
        ))}
        <div className="flex-1 flex items-center justify-end">
          <div className="bg-white rounded-xl px-3 py-2 shadow-sm border border-[#C9A961]/20 flex items-center gap-1.5">
            <Flame size={16} className="text-[#E85D04]" />
            <span className="text-sm font-bold text-[#E85D04]">{streak}</span>
            <span className="text-xs text-gray-500">天</span>
          </div>
        </div>
      </div>

      {/* 当前书目 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#2D2D2D]">当前周期</h2>
          <span className="text-xs text-[#E85D04] font-medium bg-[#E85D04]/10 px-2 py-1 rounded-full">
精读中</span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#C9A961]/15">
          <div className="flex gap-4">
            <div className="relative w-24 h-36 rounded-lg overflow-hidden shadow-md flex-shrink-0">
              <Image
                src={currentBook.cover}
                alt={currentBook.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <h3 className="font-bold text-[#2D2D2D] text-base leading-tight">
                  {currentBook.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{currentBook.subtitle}</p>
                <p className="text-xs text-[#C9A961] mt-1">作者：{currentBook.author}</p>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                  <span>已完成 {currentBook.completedChapters}/{currentBook.totalChapters} 章</span>
                  <span className="font-medium text-[#E85D04]">{currentBook.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E85D04] rounded-full transition-all"
                    style={{ width: `${currentBook.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">第 6 章 · 负责任：养育的目标是什么</span>
            <button className="flex items-center gap-1 text-xs text-[#E85D04] font-medium">
              继续阅读 <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 往期书目 */}
      <section>
        <h2 className="text-lg font-bold text-[#2D2D2D] mb-4">往期书目</h2>
        <div className="grid grid-cols-2 gap-3">
          {pastBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl p-3 shadow-sm border border-[#C9A961]/10"
            >
              <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden mb-2.5">
                <Image src={book.cover} alt={book.title} fill className="object-cover" />
              </div>
              <h3 className="text-sm font-bold text-[#2D2D2D] truncate">{book.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
