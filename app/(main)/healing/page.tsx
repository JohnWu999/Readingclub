"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart, Baby, Users, Play, BookHeart, Wind, Sun, CloudRain,
  Plus, X, Trash2, ChevronRight, Smile, Frown, Meh, AlertCircle,
  Zap, CloudLightning
} from "lucide-react";

const healingCategories = [
  {
    id: "parent",
    title: "父母情绪复原力",
    desc: "帮助你在育儻压力下恢复情绪能量",
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

const emotionOptions = [
  { value: "开心", icon: Smile, color: "bg-amber-100 text-amber-600", desc: "心情愉悦，能量充沛" },
  { value: "平静", icon: Wind, color: "bg-sky-100 text-sky-600", desc: "安定自在，心无波澜" },
  { value: "焦虑", icon: AlertCircle, color: "bg-orange-100 text-orange-600", desc: "心神不宁，担忧未来" },
  { value: "压力", icon: Zap, color: "bg-red-100 text-red-600", desc: "负担很重，空间不足" },
  { value: "疑惑", icon: Meh, color: "bg-gray-100 text-gray-600", desc: "困惑迷茫，不知所措" },
  { value: "生气", icon: CloudLightning, color: "bg-rose-100 text-rose-600", desc: "怒火中烧，难以平复" },
  { value: "难过", icon: Frown, color: "bg-indigo-100 text-indigo-600", desc: "情绪低落，心生悲哀" },
  { value: "感恩", icon: Heart, color: "bg-pink-100 text-pink-600", desc: "心存感谢，温暖幸福" },
];

interface MoodRecord {
  id: string;
  emotion: string;
  trigger: string;
  action: string;
  reflection: string;
  createdAt: string;
}

const LOCAL_STORAGE_KEY = "reading-club-mood-records";

export default function HealingPage() {
  const [activeCategory, setActiveCategory] = useState("parent");
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [records, setRecords] = useState<MoodRecord[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [form, setForm] = useState({
    emotion: "",
    trigger: "",
    action: "",
    reflection: "",
  });

  // 检查登录状态并加载数据
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setIsLoggedIn(true);
          const recordsRes = await fetch("/api/mood-records", {
            headers: { "x-user-id": data.user.id },
          });
          if (recordsRes.ok) {
            const recordsData = await recordsRes.json();
            setRecords(recordsData.records || []);
          }
        } else {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) setRecords(JSON.parse(stored));
        }
      } catch {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) setRecords(JSON.parse(stored));
      }
    };
    init();
  }, []);

  const saveToStorage = (newRecords: MoodRecord[]) => {
    if (!isLoggedIn) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newRecords));
    }
  };

  const handleSave = async () => {
    if (!form.emotion) return;

    const newRecord: MoodRecord = {
      id: Date.now().toString(),
      emotion: form.emotion,
      trigger: form.trigger,
      action: form.action,
      reflection: form.reflection,
      createdAt: new Date().toISOString(),
    };

    if (isLoggedIn) {
      try {
        const authRes = await fetch("/api/auth/me");
        const authData = await authRes.json();
        const res = await fetch("/api/mood-records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": authData.user.id,
          },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const data = await res.json();
          newRecord.id = data.record.id;
          newRecord.createdAt = data.record.createdAt;
        }
      } catch (e) {
        console.error("保存失败", e);
      }
    }

    const updated = [newRecord, ...records];
    setRecords(updated);
    saveToStorage(updated);
    setShowMoodForm(false);
    setForm({ emotion: "", trigger: "", action: "", reflection: "" });
  };

  const handleDelete = async (id: string) => {
    if (isLoggedIn) {
      try {
        const authRes = await fetch("/api/auth/me");
        const authData = await authRes.json();
        await fetch(`/api/mood-records/${id}`, {
          method: "DELETE",
          headers: { "x-user-id": authData.user.id },
        });
      } catch (e) {
        console.error("删除失败", e);
      }
    }
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    saveToStorage(updated);
  };

  const category = healingCategories.find((c) => c.id === activeCategory)!;
  const selectedEmotion = emotionOptions.find((e) => e.value === form.emotion);

  return (
    <main className="px-5 pt-6 pb-8">
      {/* 顶部标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2D2D2D]">情绪疗愈中心</h1>
        <p className="text-sm text-gray-500 mt-1">照见自己，滋养关系</p>
        {!isLoggedIn && (
          <p className="text-xs text-amber-600 mt-1">
            💡 当前记录保存在本地，登录后可同步到云端
          </p>
        )}
      </div>

      {/* 情绪日记快捷入口 */}
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-5 mb-6 border border-[#C9A961]/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookHeart size={20} className="text-rose-500" />
            <h2 className="text-base font-bold text-[#2D2D2D]">今日情绪</h2>
          </div>
          <button
            onClick={() => setShowMoodForm(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#E85D04] text-white text-xs font-medium rounded-full"
          >
            <Plus size={14} />
            记录
          </button>
        </div>

        {records.length === 0 ? (
          <p className="text-sm text-gray-400">还没有记录，点击「记录」开始第一条情绪日记</p>
        ) : (
          <div className="space-y-2">
            {records.slice(0, 3).map((record) => {
              const emotionOpt = emotionOptions.find((e) => e.value === record.emotion);
              const Icon = emotionOpt?.icon || Smile;
              return (
                <div
                  key={record.id}
                  className="bg-white/70 rounded-xl p-3 flex items-center gap-3"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${emotionOpt?.color || "bg-gray-100"}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#2D2D2D]">{record.emotion}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(record.createdAt).toLocaleDateString("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {record.trigger && (
                      <p className="text-xs text-gray-500 truncate">触发：{record.trigger}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="p-1.5 text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
            {records.length > 3 && (
              <p className="text-xs text-gray-400 text-center">
                还有 {records.length - 3} 条记录
              </p>
            )}
          </div>
        )}
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
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-bold text-gray-400">推荐练习</h3>
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
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => setShowMoodForm(true)}
          className="bg-white rounded-xl p-4 border border-[#C9A961]/10 text-center cursor-pointer"
        >
          <BookHeart size={24} className="mx-auto mb-2 text-[#C9A961]" />
          <p className="text-sm font-medium text-[#2D2D2D]">情绪日记</p>
          <p className="text-xs text-gray-400 mt-0.5">记录今日心境</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#C9A961]/10 text-center">
          <Users size={24} className="mx-auto mb-2 text-[#C9A961]" />
          <p className="text-sm font-medium text-[#2D2D2D]">家庭情绪墙</p>
          <p className="text-xs text-gray-400 mt-0.5">即将上线</p>
        </div>
      </div>

      {/* 情绪记录弹窗 */}
      {showMoodForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#2D2D2D]">记录今日情绪</h3>
              <button
                onClick={() => setShowMoodForm(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* 情绪选择 */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                当下情绪 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {emotionOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setForm({ ...form, emotion: opt.value })}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                      form.emotion === opt.value
                        ? "border-[#E85D04] bg-[#E85D04]/5"
                        : "border-transparent bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <opt.icon size={20} className={opt.color.split(" ")[1]} />
                    <span className="text-xs font-medium">{opt.value}</span>
                  </button>
                ))}
              </div>
              {selectedEmotion && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {selectedEmotion.desc}
                </p>
              )}
            </div>

            {/* 触发因素 */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">触发因素</label>
              <input
                type="text"
                placeholder="什么事情引发了这个情绪？"
                value={form.trigger}
                onChange={(e) => setForm({ ...form, trigger: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/30"
              />
            </div>

            {/* 应对方式 */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">当时的应对</label>
              <input
                type="text"
                placeholder="你是怎么处理的？"
                value={form.action}
                onChange={(e) => setForm({ ...form, action: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/30"
              />
            </div>

            {/* 反思 */}
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">事后反思</label>
              <textarea
                placeholder="现在回头看，你有什么想法？"
                value={form.reflection}
                onChange={(e) => setForm({ ...form, reflection: e.target.value })}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/30 resize-none"
              />
            </div>

            {/* 保存按钮 */}
            <button
              onClick={handleSave}
              disabled={!form.emotion}
              className="w-full py-3 rounded-xl bg-[#E85D04] text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存记录
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
