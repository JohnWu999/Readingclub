"use client";

import { useState } from "react";
import {
  User,
  Baby,
  BookOpen,
  Heart,
  ChevronRight,
  Plus,
  Sparkles,
  Link2,
} from "lucide-react";
import Link from "next/link";

const demoChildren = [
  {
    id: 1,
    name: "小明",
    age: "5 岁",
    grade: "幼儿园中班",
    interests: ["绘本", "动物"],
    currentBook: "《我的情绪小怪兽》",
    progress: 60,
  },
];

const parentToChildBooks = [
  {
    parentBook: "《非暴力沟通》",
    parentProgress: 45,
    childBook: "《我的情绪小怪兽》",
    childProgress: 60,
    connection: "情绪识别与表达",
  },
  {
    parentBook: "《正面管教》",
    parentProgress: 30,
    childBook: "《小黑鱼》",
    childProgress: 20,
    connection: "自律与责任",
  },
  {
    parentBook: "《在远远的背后带领》",
    parentProgress: 80,
    childBook: "《你很特别》",
    childProgress: 40,
    connection: "自我价值",
  },
];

export default function ChildPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    grade: "",
    interests: "",
    concerns: "",
  });

  const handleSubmit = () => {
    setShowForm(false);
  };

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
          <h1 className="text-xl font-bold text-[#2D2D2D]">孩子板块</h1>
        </div>
        <p className="text-sm text-gray-500 ml-10">
          登记孩子信息，构建家庭阅读图谱
        </p>
      </div>

      {/* 孩子卡片 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#2D2D2D]">我的孩子</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 text-xs text-[#E85D04] font-medium bg-[#E85D04]/10 px-3 py-1.5 rounded-full"
          >
            <Plus size={14} />
            添加
          </button>
        </div>

        {demoChildren.map((child) => (
          <div
            key={child.id}
            className="bg-white rounded-2xl p-5 border border-[#C9A961]/15 mb-3"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E85D04]/10 to-[#C9A961]/20 flex items-center justify-center flex-shrink-0">
                <Baby size={24} className="text-[#E85D04]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-[#2D2D2D]">
                    {child.name}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9A961]/10 text-[#C9A961]">
                    {child.age}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{child.grade}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {child.interests.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 当前阅读 */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">正在读</span>
                <span className="text-[10px] text-[#E85D04]">
                  {child.progress}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-[#E85D04]/10 to-[#C9A961]/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={16} className="text-[#E85D04]/60" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#2D2D2D]">
                    {child.currentBook}
                  </p>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
                    <div
                      className="h-full bg-[#E85D04] rounded-full transition-all"
                      style={{ width: `${child.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {demoChildren.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-[#C9A961]/10 text-center">
            <Baby size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-4">
              还没有登记孩子信息
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 rounded-xl bg-[#E85D04] text-white text-sm font-medium"
            >
              添加孩子信息
            </button>
          </div>
        )}
      </section>

      {/* 家庭阅读图谱 */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#2D2D2D]">家庭阅读图谱</h2>
          <span className="text-[10px] px-2 py-1 rounded-full bg-[#C9A961]/10 text-[#C9A961]">
            AI 关联
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          AI 根据你读的书，自动推荐孩子可以同步阅读的关联书目，形成家庭对话基础。
        </p>

        <div className="space-y-3">
          {parentToChildBooks.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 border border-[#C9A961]/10"
            >
              <div className="flex items-center justify-center mb-3">
                <span className="text-[10px] px-2 py-1 rounded-full bg-[#E85D04]/10 text-[#E85D04] flex items-center gap-1">
                  <Link2 size={10} />
                  {item.connection}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* 家长书 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={14} className="text-[#E85D04]" />
                    <span className="text-[10px] text-gray-400">家长</span>
                  </div>
                  <div className="bg-[#FAF7F2] rounded-lg p-2">
                    <p className="text-xs font-medium text-[#2D2D2D] truncate">
                      {item.parentBook}
                    </p>
                    <div className="w-full h-1 bg-gray-200 rounded-full mt-1.5">
                      <div
                        className="h-full bg-[#E85D04] rounded-full"
                        style={{ width: `${item.parentProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-gray-300">
                  <ChevronRight size={16} />
                </div>

                {/* 孩子书 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Baby size={14} className="text-[#C9A961]" />
                    <span className="text-[10px] text-gray-400">孩子</span>
                  </div>
                  <div className="bg-[#FAF7F2] rounded-lg p-2">
                    <p className="text-xs font-medium text-[#2D2D2D] truncate">
                      {item.childBook}
                    </p>
                    <div className="w-full h-1 bg-gray-200 rounded-full mt-1.5">
                      <div
                        className="h-full bg-[#C9A961] rounded-full"
                        style={{ width: `${item.childProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI 推荐 */}
      <section className="mb-8">
        <div className="bg-gradient-to-br from-[#E85D04]/5 to-[#C9A961]/10 rounded-2xl p-5 border border-[#C9A961]/15">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-[#E85D04]" />
            <h2 className="text-base font-bold text-[#2D2D2D]">AI 推荐阅读</h2>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mb-4">
            基于小明的年龄（5岁）和兴趣（绘本、动物），以及你正在读的书，AI 推荐：
          </p>
          <div className="space-y-2">
            {[
              { title: "《猜猜我有多爱你》", reason: "情感表达 · 亲子共读" },
              { title: "《好饿的毛毛虫》", reason: "动物主题 · 认知发展" },
              { title: "《我的情绪小怪兽》", reason: "情绪管理 · 与你当前书目关联" },
            ].map((book, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white rounded-xl p-3"
              >
                <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-[#E85D04]/10 to-[#C9A961]/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={16} className="text-[#E85D04]/60" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#2D2D2D]">
                    {book.title}
                  </p>
                  <p className="text-[10px] text-[#C9A961] mt-0.5">
                    {book.reason}
                  </p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 添加表单 Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-end">
          <div className="w-full bg-white rounded-t-2xl p-5 pb-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#2D2D2D]">添加孩子信息</h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">
                  昵称
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="比如：小明"
                  className="w-full p-3 rounded-xl border border-[#C9A961]/20 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#C9A961]"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1.5 block">
                    年龄
                  </label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    placeholder="5岁"
                    className="w-full p-3 rounded-xl border border-[#C9A961]/20 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#C9A961]"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1.5 block">
                    年级/阶段
                  </label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) =>
                      setFormData({ ...formData, grade: e.target.value })
                    }
                    placeholder="幼儿园中班"
                    className="w-full p-3 rounded-xl border border-[#C9A961]/20 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#C9A961]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">
                  兴趣标签（用逗号分隔）
                </label>
                <input
                  type="text"
                  value={formData.interests}
                  onChange={(e) =>
                    setFormData({ ...formData, interests: e.target.value })
                  }
                  placeholder="绘本、动物、太空..."
                  className="w-full p-3 rounded-xl border border-[#C9A961]/20 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#C9A961]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">
                  当前育儿困惑（可选）
                </label>
                <textarea
                  value={formData.concerns}
                  onChange={(e) =>
                    setFormData({ ...formData, concerns: e.target.value })
                  }
                  placeholder="比如：孩子情绪管理、作业拖拉..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-[#C9A961]/20 bg-[#FAF7F2] text-sm resize-none focus:outline-none focus:border-[#C9A961]"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-xl bg-[#E85D04] text-white text-sm font-medium mt-2"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
