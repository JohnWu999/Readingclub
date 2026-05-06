"use client";

import { useState, useEffect } from "react";
import {
  Baby,
  BookOpen,
  ChevronRight,
  Plus,
  Sparkles,
  Link2,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface ChildData {
  id: string;
  name: string;
  age: string;
  grade: string;
  interests: string[];
  currentBook: string;
  progress: number;
}

const LOCAL_STORAGE_KEY = "reading-club-children";

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
  const [children, setChildren] = useState<ChildData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    grade: "",
    interests: "",
    currentBook: "",
  });

  // 检查登录状态并加载数据
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setIsLoggedIn(true);
          // 已登录：从服务器获取
          const membersRes = await fetch("/api/family-members");
          if (membersRes.ok) {
            const membersData = await membersRes.json();
            const mapped = membersData.members.map((m: any) => ({
              id: m.id,
              name: m.name,
              age: m.age || "",
              grade: m.grade || "",
              interests: m.interests ? m.interests.split(",").filter(Boolean) : [],
              currentBook: m.currentBook || "",
              progress: m.progress || 0,
            }));
            setChildren(mapped);
          }
        } else {
          // 未登录：从 localStorage 获取
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
            setChildren(JSON.parse(stored));
          }
        }
      } catch (e) {
        // 出错时从 localStorage 获取
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          setChildren(JSON.parse(stored));
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // 保存到 localStorage（未登录时）
  const saveToLocal = (data: ChildData[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  };

  const handleSubmit = async () => {
    if (!formData.name) return;

    const newChild: ChildData = {
      id: Date.now().toString(),
      name: formData.name,
      age: formData.age,
      grade: formData.grade,
      interests: formData.interests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      currentBook: formData.currentBook,
      progress: 0,
    };

    if (isLoggedIn) {
      try {
        const res = await fetch("/api/family-members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            relation: "子女",
            age: formData.age,
            grade: formData.grade,
            interests: formData.interests,
            currentBook: formData.currentBook,
            progress: 0,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          newChild.id = data.member.id;
        }
      } catch (e) {
        console.error("保存失败:", e);
      }
    }

    const updated = [...children, newChild];
    setChildren(updated);
    if (!isLoggedIn) saveToLocal(updated);

    setFormData({ name: "", age: "", grade: "", interests: "", currentBook: "" });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (isLoggedIn) {
      try {
        await fetch(`/api/family-members/${id}`, { method: "DELETE" });
      } catch (e) {
        console.error("删除失败:", e);
      }
    }
    const updated = children.filter((c) => c.id !== id);
    setChildren(updated);
    if (!isLoggedIn) saveToLocal(updated);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] px-5 pt-8 pb-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-32" />
          <div className="h-40 bg-gray-200 rounded-xl" />
        </div>
      </main>
    );
  }

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

      {/* 未登录提示 */}
      {!isLoggedIn && (
        <div className="mb-6 bg-[#E85D04]/5 border border-[#E85D04]/20 rounded-xl p-4">
          <p className="text-sm text-[#E85D04]">
            💡 当前数据保存在本地，登录后可同步到云端
          </p>
        </div>
      )}

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

        {children.length > 0 ? (
          children.map((child) => (
            <div
              key={child.id}
              className="bg-white rounded-2xl p-5 border border-[#C9A961]/15 mb-3 relative"
            >
              <button
                onClick={() => handleDelete(child.id)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
              </button>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E85D04]/10 to-[#C9A961]/20 flex items-center justify-center flex-shrink-0">
                  <Baby size={24} className="text-[#E85D04]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-[#2D2D2D]">
                      {child.name}
                    </h3>
                    {child.age && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9A961]/10 text-[#C9A961]">
                        {child.age}
                      </span>
                    )}
                  </div>
                  {child.grade && (
                    <p className="text-xs text-gray-500">{child.grade}</p>
                  )}
                  {child.interests.length > 0 && (
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
                  )}
                </div>
              </div>

              {/* 当前阅读 */}
              {child.currentBook && (
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
              )}
            </div>
          ))
        ) : (
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
      {children.length > 0 && (
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
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

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
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
      )}

      {/* AI 推荐 */}
      {children.length > 0 && (
        <section className="mb-8">
          <div className="bg-gradient-to-br from-[#E85D04]/5 to-[#C9A961]/10 rounded-2xl p-5 border border-[#C9A961]/15">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-[#E85D04]" />
              <h2 className="text-base font-bold text-[#2D2D2D]">AI 推荐阅读</h2>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {children[0]?.name ? `基于${children[0].name}的信息，AI 推荐：` : "AI 推荐："}
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
      )}

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
                  昵称 <span className="text-[#E85D04]">*</span>
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
                  正在读的书
                </label>
                <input
                  type="text"
                  value={formData.currentBook}
                  onChange={(e) =>
                    setFormData({ ...formData, currentBook: e.target.value })
                  }
                  placeholder="比如：《我的情绪小怪兽》"
                  className="w-full p-3 rounded-xl border border-[#C9A961]/20 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#C9A961]"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!formData.name}
                className="w-full py-3 rounded-xl bg-[#E85D04] text-white text-sm font-medium mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
