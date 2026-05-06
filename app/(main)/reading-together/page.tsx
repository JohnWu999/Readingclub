"use client";

import { useState } from "react";
import {
  BookOpen,
  MessageCircle,
  Sparkles,
  User,
  Bot,
  ChevronRight,
  Zap,
  Heart,
  BrainCircuit,
} from "lucide-react";
import Link from "next/link";

const readingModes = [
  {
    id: "solo",
    title: "自己读",
    subtitle: "传统阅读",
    desc: "安静翻阅，享受独处时光。有问题随时唤出 AI。",
    icon: BookOpen,
    color: "#2D2D2D",
    bgColor: "bg-white",
    active: false,
  },
  {
    id: "together",
    title: "AI 伴读",
    subtitle: "同桌共读",
    desc: "AI 也在读这本书，页边有批注，随时可讨论。",
    icon: MessageCircle,
    color: "#E85D04",
    bgColor: "bg-[#E85D04]/5",
    active: true,
  },
  {
    id: "ai-first",
    title: "让 AI 先读",
    subtitle: "预习模式",
    desc: "AI 提前读完，生成精华地图 + 提问清单，降低门槛。",
    icon: Sparkles,
    color: "#C9A961",
    bgColor: "bg-[#C9A961]/5",
    active: false,
  },
];

const aiCompanionTraits = [
  { icon: Heart, label: "共情", desc: "理解你的育儿焦虑" },
  { icon: BrainCircuit, label: "记忆", desc: "记住你的阅读 DNA" },
  { icon: Zap, label: "轻推", desc: "不直给答案，引导思考" },
  { icon: MessageCircle, label: "对话", desc: "模拟孩子角色练习" },
];

const demoAnnotations = [
  {
    page: "第 3 章",
    quote: "\"没有输家的冲突解决法\"",
    aiNote: "我读到这儿时想到：很多家长说'第三法'太理想化。你在家里试过让孩子参与决策吗？",
  },
  {
    page: "第 5 章",
    quote: "\"积极倾听\"",
    aiNote: "这段有个易错点：积极倾听≠赞同孩子。只是让孩子感到'被听见'。你平时能做到只听不给建议吗？",
  },
  {
    page: "第 7 章",
    quote: "\"我信息\"",
    aiNote: "这里可以做个小练习：试着把'你怎么又不收拾'改成'我看到地上有玩具，我很担心有人踩到摔倒'。",
  },
];

export default function ReadingTogetherPage() {
  const [selectedMode, setSelectedMode] = useState("together");
  const [showDemo, setShowDemo] = useState(false);

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 pt-8 pb-12">
      {/* 顶部 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/"
            className="w-8 h-8 rounded-full bg-white border border-[#C9A961]/20 flex items-center justify-center text-gray-400 hover:text-[#E85D04] transition-colors"
          >
            <span className="text-sm">←</span>
          </Link>
          <h1 className="text-xl font-bold text-[#2D2D2D]">AI 共读</h1>
        </div>
        <p className="text-sm text-gray-500 ml-10">
          不是问答，是和你一起读书
        </p>
      </div>

      {/* 三种阅读模式 */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-[#2D2D2D] mb-4">
          选择阅读方式
        </h2>
        <div className="space-y-3">
          {readingModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setSelectedMode(mode.id);
                  if (mode.id === "together") setShowDemo(true);
                  else setShowDemo(false);
                }}
                className={`w-full text-left rounded-2xl p-4 border transition-all ${
                  isSelected
                    ? "border-[#E85D04]/40 bg-white shadow-sm"
                    : "border-[#C9A961]/10 bg-white/60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-[#E85D04]/10" : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      size={20}
                      style={{ color: isSelected ? "#E85D04" : "#999" }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className="font-bold text-[15px]"
                        style={{
                          color: isSelected ? mode.color : "#2D2D2D",
                        }}
                      >
                        {mode.title}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        {mode.subtitle}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {mode.desc}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#E85D04] flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-[10px]">✓</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* AI 伴读演示 */}
      {selectedMode === "together" && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#2D2D2D]">
              AI 伴读体验
            </h2>
            <span className="text-[10px] px-2 py-1 rounded-full bg-[#E85D04]/10 text-[#E85D04]">
              演示
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#C9A961]/15 overflow-hidden">
            {/* 书页头部 */}
            <div className="px-4 py-3 border-b border-gray-100 bg-[#FAF7F2]/50">
              <p className="text-xs text-gray-400">正在共读</p>
              <p className="text-sm font-bold text-[#2D2D2D]">
                《在远远的背后带领》
              </p>
            </div>

            {/* 批注列表 */}
            <div className="divide-y divide-gray-50">
              {demoAnnotations.map((anno, i) => (
                <div key={i} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                      {anno.page}
                    </span>
                    <p className="text-xs text-[#C9A961] italic">
                      {anno.quote}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E85D04] to-[#C9A961] flex items-center justify-center flex-shrink-0">
                      <Bot size={12} className="text-white" />
                    </div>
                    <div className="bg-[#FAF7F2] rounded-xl rounded-tl-sm px-3 py-2 flex-1">
                      <p className="text-xs text-[#4A4A4A] leading-relaxed">
                        {anno.aiNote}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 底部操作 */}
            <div className="px-4 py-3 border-t border-gray-100">
              <button className="w-full py-2.5 rounded-xl bg-[#E85D04] text-white text-sm font-medium flex items-center justify-center gap-2">
                <MessageCircle size={16} />
                继续和 AI 讨论这一章
              </button>
            </div>
          </div>
        </section>
      )}

      {/* AI 分身介绍 */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-[#2D2D2D] mb-4">
          你的 AI 阅读分身
        </h2>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          不是通用 AI，是专属于你的阅读搭档。它会记住你的偏好、卡壳的地方、最敏感的话题。
        </p>

        <div className="grid grid-cols-2 gap-3">
          {aiCompanionTraits.map((trait, i) => {
            const Icon = trait.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl p-4 border border-[#C9A961]/10"
              >
                <Icon size={18} className="text-[#E85D04] mb-2" />
                <h3 className="text-sm font-bold text-[#2D2D2D]">
                  {trait.label}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1">{trait.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 角色扮演 */}
      <section className="mb-10">
        <div className="bg-gradient-to-br from-[#E85D04]/5 to-[#C9A961]/10 rounded-2xl p-5 border border-[#C9A961]/15">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-[#E85D04]" />
            <h2 className="text-base font-bold text-[#2D2D2D]">
              角色扮演练习
            </h2>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mb-4">
            读《正面管教》时，让 AI 扮演一个哭闹的 5
            岁孩子，你试着用书中的方法回应。AI 会给你实时反馈。
          </p>
          <div className="flex gap-3">
            <div className="flex-1 bg-white rounded-xl p-3 text-center">
              <User size={20} className="text-[#C9A961] mx-auto mb-1" />
              <p className="text-[11px] text-gray-500">你</p>
              <p className="text-xs font-bold text-[#2D2D2D]">家长</p>
            </div>
            <div className="flex items-center text-gray-300">
              <ChevronRight size={16} />
            </div>
            <div className="flex-1 bg-white rounded-xl p-3 text-center">
              <Bot size={20} className="text-[#E85D04] mx-auto mb-1" />
              <p className="text-[11px] text-gray-500">AI</p>
              <p className="text-xs font-bold text-[#2D2D2D]">5 岁孩子</p>
            </div>
          </div>
        </div>
      </section>

      {/* 底部 CTA */}
      <div className="sticky bottom-0 -mx-5 px-5 py-3 bg-white/90 backdrop-blur border-t border-[#C9A961]/10">
        <button className="w-full py-3 rounded-xl bg-[#E85D04] text-white text-sm font-medium shadow-sm">
          开始 AI 共读
        </button>
      </div>
    </main>
  );
}
