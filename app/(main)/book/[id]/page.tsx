"use client";

import { useState } from "react";
import { BookOpen, Headphones, FileText, MessageCircle } from "lucide-react";
import AudioPlayer from "@/components/audio-player/audio-player";
import CommentThread from "@/components/comment-thread/comment-thread";

const tabs = [
  { id: "guide", label: "阅读引导", icon: BookOpen },
  { id: "audio", label: "音频导读", icon: Headphones },
  { id: "materials", label: "学习资料", icon: FileText },
  { id: "discuss", label: "讨论区", icon: MessageCircle },
];

const bookData = {
  title: "在远远的背后带领",
  subtitle: "PET父母效能训练的中国实践",
  author: "安心",
  guide: {
    why: `这是一本关于“如何成为一个不控制、不评判、却能深度影响孩子”的书。

安心老师将 PET（父母效能训练）的核心理念与中国家庭的实际情况相结合，用真实案例告诉我们：当我们放下“好父母”的拒子，转而成为“真实的自己”，孩子自然会被吸引。`,
    core: [
      { title: "不越界", desc: "父母的边界感，是孩子安全感的基础" },
      { title: "不评判", desc: "放下对错，看见孩子的需求" },
      { title: "负责任", desc: "谁的问题，谁来解决" },
      { title: "无伤害", desc: "语言的力量可以养育，也可以伤害" },
    ],
    tips: `【阅读建议】
· 每天读 1 章，不要赶进
· 做笔记：哪一句话触动了你？
· 实践：每天试着用一个 PET 技巧与孩子对话`,
  },
  audioChapters: [
    { id: "a1", title: "导读：为什么推荐这本书", duration: 480, type: "HUMAN" as const },
    { id: "a2", title: "Ch1 不越界：什么是父母的边界", duration: 720, type: "HUMAN" as const },
    { id: "a3", title: "Ch2 不评判：放下对错，看见孩子", duration: 600, type: "AI_CLONE" as const },
    { id: "a4", title: "Ch3 负责任：养育的目标是什么", duration: 660, type: "AI_CLONE" as const },
    { id: "a5", title: "Ch4 无伤害：语言的力量与暴力", duration: 780, type: "AI_CLONE" as const },
  ],
  materials: [
    { title: "PET 核心概念思维导图", type: "pdf", size: "2.3MB" },
    { title: "本书金句卡片 x9", type: "image", size: "5.1MB" },
    { title: "读书笔记模板", type: "pdf", size: "0.8MB" },
    { title: "「我信息」练习表", type: "pdf", size: "1.1MB" },
  ],
  comments: [
    {
      id: "c1",
      user: { name: "小麦妈妈", avatar: "" },
      content: "第一章就被震慑到了！我之前总是习惯性地帮孩子做决定，原来这是在侵犯他的边界。今天试着问了孩子“你想怎么做？”，看到他眼睛里的光，突然觉得好久没见到了。",
      time: "2小时前",
      likes: 12,
      replies: [],
    },
  ],
};

export default function BookPage() {
  const [activeTab, setActiveTab] = useState("guide");

  return (
    <div className="pb-24">
      {/* 书籍信息卡片 */}
      <div className="bg-white px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-24 bg-gradient-to-br from-[#E85D04]/20 to-[#C9A961]/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen size={28} className="text-[#E85D04]/60" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-[#2D2D2D]">{bookData.title}</h1>
            <p className="text-xs text-gray-500 mt-0.5">{bookData.subtitle}</p>
            <p className="text-xs text-[#C9A961] mt-1">作者：{bookData.author}</p>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-gray-100 -mx-5 px-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 py-3 px-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "text-[#E85D04] border-[#E85D04]"
                  : "text-gray-400 border-transparent"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区 */}
      <div className="px-5 pt-4">
        {activeTab === "guide" && (
          <div className="space-y-6">
            {/* 为什么读 */}
            <section>
              <h2 className="text-base font-bold text-[#2D2D2D] mb-2">为什么推荐这本书？</h2>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {bookData.guide.why}
              </div>
            </section>

            {/* 核心观点 */}
            <section>
              <h2 className="text-base font-bold text-[#2D2D2D] mb-3">本书核心观点</h2>
              <div className="grid grid-cols-2 gap-3">
                {bookData.guide.core.map((item) => (
                  <div
                    key={item.title}
                    className="bg-white rounded-xl p-3 border border-[#C9A961]/15"
                  >
                    <h3 className="text-sm font-bold text-[#E85D04] mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 阅读建议 */}
            <section className="bg-white rounded-xl p-4 border border-[#C9A961]/15">
              <h2 className="text-sm font-bold text-[#C9A961] mb-2">阅读建议</h2>
              <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                {bookData.guide.tips}
              </div>
            </section>
          </div>
        )}

        {activeTab === "audio" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 mb-2">共 {bookData.audioChapters.length} 章音频</p>
            <AudioPlayer chapters={bookData.audioChapters} />
          </div>
        )}

        {activeTab === "materials" && (
          <div className="space-y-3">
            {bookData.materials.map((m, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 flex items-center justify-between border border-[#C9A961]/15"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] flex items-center justify-center">
                    <FileText size={20} className="text-[#C9A961]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2D2D2D]">{m.title}</p>
                    <p className="text-xs text-gray-400">{m.type.toUpperCase()} · {m.size}</p>
                  </div>
                </div>
                <button className="text-xs text-[#E85D04] font-medium px-3 py-1.5 bg-[#E85D04]/10 rounded-full">
                  下载
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "discuss" && (
          <CommentThread comments={bookData.comments} />
        )}
      </div>
    </div>
  );
}
