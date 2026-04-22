"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Baby, Users, Play, BookHeart, Wind, Sun, CloudRain } from "lucide-react";

const healingCategories = [
  {
    id: "parent",
    title: "父母情绪复原力",
    desc: "帮助你在育儿压力下恢复情绪能量",
    icon: Heart,
    color: "from-rose-50 to-orange-50",
    iconColor: "text-rose-500",
    items: [
      { title: "晨起正念冥想", duration: "8min", icon: Sun },
      { title: "情绪急救练习", duration: "5min", icon: CloudRain },
      { title: "睡前放松引导", duration: "10min", icon: Wind },
    ],
  },
  {
    id: "child",
    title: "孩子情绪小课堂",
    desc: "用孩子能听懂的方式认识情绪",
    icon: Baby,
    color: "from-sky-50 to-blue-50",
    iconColor: "text-sky-500",
    items: [
      { title: "生气的小火山", duration: "6min", icon: CloudRain },
      { title: "害怕的小影子", duration: "5min", icon: Wind },
      { title: "开心的小太阳", duration: "7min", icon: Sun },
    ],
  },
  {
    id: "family",
    title: "亲子专区",
    desc: "父母和孩子一起参与的情绪练习",
    icon: Users,
    color: "from-amber-50 to-yellow-50",
    iconColor: "text-amber-500",
    items: [
      { title: "情绪天气预报", duration: "3min", icon: Sun },
      { title: "正念拥抱时刻", duration: "2min", icon: Heart },
      { title: "家庭情绪公约", duration: "5min", icon: BookHeart },
    ],
  },
];

export default function HealingPage() {
  const [activeCategory, setActiveCategory] = useState("parent");
  const category = healingCategories.find((c) => c.id === activeCategory)!;

  return (
    <main className="px-5 pt-6 pb-8">
      {/* 顶部标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2D2D2D]">情绪疗愈中心</h1>
        <p className="text-sm text-gray-500 mt-1">照见自己，滋养关系</p>
      </div>

      {/* 分类切换 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {healingCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? "bg-[#E85D04] text-white shadow-md"
                : "bg-white text-gray-500 border border-gray-100"
            }`}
          >
            <cat.icon size={16} />
            {cat.title}
          </button>
        ))}
      </div>

      {/* 当前版块卡片 */}
      <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-5 mb-6 border border-[#C9A961]/10`}>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-full bg-white/80 flex items-center justify-center ${category.iconColor}`}>
            <category.icon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#2D2D2D]">{category.title}</h2>
            <p className="text-xs text-gray-500">{category.desc}</p>
          </div>
        </div>
      </div>

      {/* 内容列表 */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-400 mb-2">推荐练习</h3>
        {category.items.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 flex items-center gap-3 border border-[#C9A961]/10"
          >
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] flex items-center justify-center flex-shrink-0">
              <item.icon size={22} className="text-[#C9A961]" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#2D2D2D]">{item.title}</h4>
              <p className="text-xs text-gray-400 mt-0.5">{item.duration}</p>
            </div>
            <button className="w-9 h-9 rounded-full bg-[#E85D04] text-white flex items-center justify-center flex-shrink-0">
              <Play size={16} className="ml-0.5" />
            </button>
          </div>
        ))}
      </div>

      {/* 快捷入口 */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          href="/me/journal"
          className="bg-white rounded-xl p-4 border border-[#C9A961]/10 text-center"
        >
          <BookHeart size={24} className="mx-auto mb-2 text-[#C9A961]" />
          <p className="text-sm font-medium text-[#2D2D2D]">情绪日记</p>
          <p className="text-xs text-gray-400 mt-0.5">记录今日心境</p>
        </Link>
        <div className="bg-white rounded-xl p-4 border border-[#C9A961]/10 text-center">
          <Users size={24} className="mx-auto mb-2 text-[#C9A961]" />
          <p className="text-sm font-medium text-[#2D2D2D]">家庭情绪墙</p>
          <p className="text-xs text-gray-400 mt-0.5">即将上线</p>
        </div>
      </div>
    </main>
  );
}
