"use client";

import { useState, useEffect } from "react";
import { Flame, BookOpen, Heart, Users, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface CheckIn {
  id: string;
  type: string;
  createdAt: string;
  content?: string | null;
}

interface User {
  id: string;
  phone: string;
  nickname: string;
}

export default function CheckInPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [message, setMessage] = useState("");
  const [currentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUser(data.user);
      await fetchCheckIns();
    } catch (e) {
      setUser(null);
      setLoading(false);
    }
  };

  const fetchCheckIns = async () => {
    try {
      const res = await fetch("/api/checkin/list");
      if (!res.ok) {
        setCheckIns([]);
        return;
      }
      const data = await res.json();
      setCheckIns(data.checkIns || []);
    } catch (e) {
      console.error(e);
      setCheckIns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (type: string = "READING") => {
    setCheckingIn(true);
    setMessage("");
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("打卡成功！");
        fetchCheckIns();
      } else if (res.status === 409) {
        setMessage("今天已经打卡过了~");
      } else {
        setMessage(data.error || "打卡失败");
      }
    } catch (e) {
      setMessage("网络错误");
    } finally {
      setCheckingIn(false);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const { streak, monthCount, totalCount } = getStats(checkIns);

  const getCheckInForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayCheckIns = checkIns.filter((c) =>
      new Date(c.createdAt).toISOString().slice(0, 10) === dateStr
    );
    return dayCheckIns.map((c) => c.type);
  };

  const typeConfig: Record<string, { color: string; icon: typeof Flame }> = {
    READING: { color: "bg-[#E85D04]", icon: BookOpen },
    EMOTION: { color: "bg-green-500", icon: Heart },
    FAMILY: { color: "bg-sky-500", icon: Users },
  };

  if (loading) {
    return (
      <main className="px-5 pt-6 pb-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-32" />
          <div className="h-32 bg-gray-200 rounded-xl" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="px-5 pt-6 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/me" className="text-gray-400">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-[#2D2D2D]">打卡日历</h1>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-[#C9A961]/15 text-center">
          <p className="text-sm text-gray-500 mb-4">登录后可记录打卡</p>
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

  return (
    <main className="px-5 pt-6 pb-8">
      {/* 顶部 */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/me" className="text-gray-400">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold text-[#2D2D2D]">打卡日历</h1>
      </div>

      {/* 今日打卡按钮 */}
      <div className="mb-4">
        <button
          onClick={() => handleCheckIn("READING")}
          disabled={checkingIn}
          className="w-full bg-[#E85D04] text-white py-3 rounded-xl font-medium shadow-sm disabled:opacity-60"
        >
          {checkingIn ? "打卡中..." : "📚 今日读书打卡"}
        </button>
        {message && (
          <p className="text-center text-sm mt-2 text-[#E85D04]">{message}</p>
        )}
      </div>

      {/* 统计卡片 */}
      <div className="bg-white rounded-2xl p-5 border border-[#C9A961]/15 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-3xl font-bold text-[#E85D04]">{streak}</p>
            <p className="text-xs text-gray-400 mt-1">连续打卡</p>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div className="text-center flex-1">
            <p className="text-3xl font-bold text-[#C9A961]">{monthCount}</p>
            <p className="text-xs text-gray-400 mt-1">本月打卡</p>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div className="text-center flex-1">
            <p className="text-3xl font-bold text-[#2D2D2D]">{totalCount}</p>
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
            const isToday = day === currentDate.getDate();

            return (
              <div
                key={day}
                className={`aspect-square rounded-lg flex items-center justify-center relative ${
                  isToday ? "ring-1 ring-[#E85D04]" : ""
                }`}
              >
                <span
                  className={`text-xs ${
                    isToday ? "font-bold text-[#E85D04]" : "text-gray-600"
                  }`}
                >
                  {day}
                </span>
                {types.length > 0 && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {types.map((t) => (
                      <div
                        key={t}
                        className={`w-1 h-1 rounded-full ${
                          typeConfig[t]?.color || "bg-gray-300"
                        }`}
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

function getStats(checkIns: CheckIn[]) {
  const totalCount = checkIns.length;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthCount = checkIns.filter((c) => {
    const d = new Date(c.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  // Calculate streak
  const uniqueDates = checkIns
    .map((c) => new Date(c.createdAt).toISOString().slice(0, 10))
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort()
    .reverse();

  let streak = 0;
  const today = now.toISOString().slice(0, 10);
  const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);

  if (uniqueDates.length > 0) {
    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
      streak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prev = new Date(uniqueDates[i - 1]);
        const curr = new Date(uniqueDates[i]);
        const diff = (prev.getTime() - curr.getTime()) / 86400000;
        if (diff === 1) streak++;
        else break;
      }
    }
  }

  return { streak, monthCount, totalCount };
}
