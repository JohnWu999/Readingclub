"use client";

import { useState } from "react";
import { Flame, BookOpen, Heart, Users, ChevronLeft } from "lucide-react";
import Link from "next/link";

const checkInData = [
  { date: "2026-04-22", types: ["READING", "EMOTION"] },
  { date: "2026-04-21", types: ["READING"] },
  { date: "2026-04-20", types: ["READING", "FAMILY"] },
  { date: "2026-04-19", types: ["READING", "EMOTION", "FAMILY"] },
  { date: "2026-04-18", types: ["READING"] },
  { date: "2026-04-17", types: ["READING", "EMOTION"] },
  { date: "2026-04-16", types: ["READING"] },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CheckInPage() {
  const [currentDate] = useState(new Date(2026, 3, 22)); // April 2026
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const getCheckInForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return checkInData.find((d) => d.date === dateStr)?.types || [];
  };

  const typeConfig: Record<string, { color: string; icon: typeof Flame }> = {
    READING: { color: "bg-[#E85D04]", icon: BookOpen },
    EMOTION: { color: "bg-green-500", icon: Heart },
    FAMILY: { color: "bg-sky-500", icon: Users },
  };

  return (
    <main className="px-5 pt-6 pb-8">
      {/* 顶部 */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/me" className="text-gray-400">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold text-[#2D2D2D]">打卡日历</h1>
      </div>

      {/* 统计卡片 */}
      <div className="bg-white rounded-2xl p-5 border border-[#C9A961]/15 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-3xl font-bold text-[#E85D04]">7</p>
            <p className="text-xs text-gray-400 mt-1">连续打卡</p>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div className="text-center flex-1">
            <p className="text-3xl font-bold text-[#C9A961]">12</p>
            <p className="text-xs text-gray-400 mt-1">本月打卡</p>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div className="text-center flex-1">
            <p className="text-3xl font-bold text-[#2D2D2D]">86</p>
            <p className="text-xs text-gray-400 mt-1">总打卡</p>
          </div>
        </div>
      </div>

      {/* 日历 */}
      <div className="bg-white rounded-2xl p-4 border border-[#C9A961]/15">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#2D2D2D]">
            {year}年{month + 1}月
          </h2>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#E85D04]" />
              <span className="text-gray-400">读书</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-400">情绪</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-sky-500" />
              <span className="text-gray-400">亲子</span>
            </div>
          </div>
        </div>

        {/* 星期标题 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
            <div key={d} className="text-center text-xs text-gray-400 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* 日期网格 */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const types = getCheckInForDate(day);
            const isToday = day === 22;

            return (
              <div
                key={day}
                className={`aspect-square rounded-lg flex items-center justify-center relative ${
                  isToday ? "ring-1 ring-[#E85D04]" : ""
                }`}
              >
                <span className={`text-xs ${isToday ? "font-bold text-[#E85D04]" : "text-gray-600"}`}>
                  {day}
                </span>
                {types.length > 0 && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {types.map((t) => (
                      <div
                        key={t}
                        className={`w-1 h-1 rounded-full ${typeConfig[t]?.color || "bg-gray-300"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
