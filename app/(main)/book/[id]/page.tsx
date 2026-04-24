"use client";

import { useState, useEffect } from "react";
import { BookOpen, Headphones, FileText, ChevronRight, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";

interface Book {
  id: string;
  title: string;
  subtitle: string | null;
  author: string;
  description: string | null;
  readingGuide: string | null;
  chapters: Chapter[];
  materials: Material[];
}

interface Chapter {
  id: string;
  title: string;
  order: number;
  summary: string | null;
  content: string | null;
  outline: string | null;
  audioFiles: AudioFile[];
}

interface AudioFile {
  id: string;
  title: string;
  url: string;
  duration: number;
  type: string;
}

interface Material {
  id: string;
  title: string;
  url: string;
  type: string;
}

const tabs = [
  { id: "guide", label: "阅读引导", icon: BookOpen },
  { id: "chapters", label: "共读", icon: Headphones },
  { id: "materials", label: "学习资料", icon: FileText },
];

export default function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const [book, setBook] = useState<Book | null>(null);
  const [activeTab, setActiveTab] = useState("guide");
  const [loading, setLoading] = useState(true);
  const [bookId, setBookId] = useState<string>("");
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  
  // 用户困惑和章节洞察
  const [userProblems, setUserProblems] = useState<string[]>([]);
  const [chapterInsights, setChapterInsights] = useState<Record<string, number>>({});
  const [hasCheckedProblem, setHasCheckedProblem] = useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      setBookId(id);
      fetch(`/api/books/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.book) setBook(data.book);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  }, [params]);

  // 获取用户困惑和章节洞察
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setHasCheckedProblem(true);
      // 建议用户完成入门问卷
      return;
    }

    // 获取用户困惑
    fetch(`/api/user/problem?userId=${userId}`)
      .then(r => r.json())
      .then(data => {
        if (data.hasProblem) {
          setUserProblems(data.problems);
          // 获取章节洞察数量
          fetchChapterInsights(data.problems);
        }
        setHasCheckedProblem(true);
      })
      .catch(() => setHasCheckedProblem(true));
  }, [book]);

  const fetchChapterInsights = async (problems: string[]) => {
    // 简单模拟：根据问题关键词和章节标题匹配
    const insights: Record<string, number> = {};
    
    if (book?.chapters) {
      book.chapters.forEach(ch => {
        let matchCount = 0;
        problems.forEach(problem => {
          const keywords = problem.split(/[\uff0c\u3002\uff01\uff1f\s]+/).filter(k => k.length > 1);
          keywords.forEach(kw => {
            if (ch.title.includes(kw) || (ch.summary && ch.summary.includes(kw))) {
              matchCount++;
            }
          });
        });
        if (matchCount > 0) {
          insights[ch.id] = matchCount;
        }
      });
    }
    
    setChapterInsights(insights);
  };

  if (loading) {
    return (
      <div className="pb-24 px-5 pt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="h-40 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="pb-24 px-5 pt-6">
        <p className="text-gray-500">书籍不存在</p>
      </div>
    );
  }

  const allAudioFiles = book.chapters.flatMap((ch) =>
    ch.audioFiles.map((af) => ({ ...af, chapterTitle: ch.title }))
  );

  return (
    <div className="pb-24">
      {/* 书籍信息卡片 */}
      <div className="bg-white px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-24 bg-gradient-to-br from-[#E85D04]/20 to-[#C9A961]/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen size={28} className="text-[#E85D04]/60" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-[#2D2D2D]">{book.title}</h1>
            <p className="text-xs text-gray-500 mt-0.5">{book.subtitle}</p>
            <p className="text-xs text-[#C9A961] mt-1">作者：{book.author}</p>
          </div>
        </div>

        {/* 用户困惑提示入口 */}
        {hasCheckedProblem && userProblems.length === 0 && (
          <Link
            href="/onboarding"
            className="flex items-center gap-3 p-3 mb-4 bg-gradient-to-r from-[#E85D04]/10 to-[#C9A961]/10 rounded-xl border border-[#E85D04]/20"
          >
            <div className="w-10 h-10 rounded-full bg-[#E85D04]/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-[#E85D04]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#2D2D2D]">让AI为你找到书中的答案</p>
              <p className="text-xs text-[#3D352E]/60 mt-0.5">填写你的育儿困惑，每章会标注相关内容提示</p>
            </div>
            <ChevronRight size={16} className="text-[#E85D04]" />
          </Link>
        )}

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
      <div className="px-5 pt-6">
        {activeTab === "guide" && (
          <div className="space-y-8">
            <section>
              <h2 className="text-base font-bold text-[#2D2D2D] mb-4">为什么推荐这本书？</h2>
              <div className="text-[15px] text-gray-600 leading-[1.8] whitespace-pre-line">
                {book.description || "暂无介绍"}
              </div>
            </section>

            {book.readingGuide && (
              <section className="bg-white rounded-xl p-5 border border-[#C9A961]/15">
                <h2 className="text-sm font-bold text-[#C9A961] mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#C9A961] rounded-full" />
                  阅读建议
                </h2>
                <div className="text-[14px] text-gray-600 leading-[1.9] whitespace-pre-line">
                  {book.readingGuide}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-base font-bold text-[#2D2D2D] mb-4">章节列表</h2>
              <div className="space-y-3">
                {book.chapters.map((ch) => {
                  const isExpanded = expandedChapter === ch.id;
                  const outlineItems = ch.outline ? JSON.parse(ch.outline) : [];
                  const insightCount = chapterInsights[ch.id] || 0;
                  const hasInsight = insightCount > 0;
                  
                  return (
                    <div
                      key={ch.id}
                      className={`bg-white rounded-xl border overflow-hidden transition-shadow ${
                        hasInsight ? "border-[#E85D04]/30 shadow-sm" : "border-[#C9A961]/10"
                      }`}
                    >
                      {/* 章节头部 — 点击展开/收起 */}
                      <button
                        onClick={() => setExpandedChapter(isExpanded ? null : ch.id)}
                        className="w-full flex items-center justify-between p-3.5 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center min-w-[36px]">
                            <span className="text-[9px] text-gray-400 uppercase">Day</span>
                            <span className="text-lg font-bold text-[#E85D04]">{ch.order}</span>
                          </div>
                          <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#C9A961]/20 to-transparent" />
                          <div>
                            <p className="text-sm font-medium text-[#2D2D2D]">{ch.title}</p>
                            {hasInsight && (
                              <p className="text-[10px] text-[#E85D04] mt-0.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E85D04] inline-block" />
                                本章有{insightCount}个与你相关的提示
                              </p>
                            )}
                          </div>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`text-[#C9A961]/60 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* 展开内容 */}
                      {isExpanded && (
                        <div className="px-3.5 pb-3.5">
                          <div className="border-t border-[#C9A961]/10 pt-3">
                            {outlineItems.length > 0 ? (
                              <div className="space-y-2">
                                <p className="text-xs text-[#C9A961] font-medium mb-1.5">
                                  本章结构
                                </p>
                                {outlineItems.map((section: string, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2 text-xs text-gray-600"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A961] mt-1.5 flex-shrink-0" />
                                    <span className="leading-relaxed">{section}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 italic">暂无章节大纲</p>
                            )}
                            <Link
                              href={`/book/${book.id}/chapter/${ch.id}`}
                              className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-[#E85D04]/8 text-[#E85D04] text-xs font-medium hover:bg-[#E85D04]/15 transition-colors"
                            >
                              <BookOpen size={14} />
                              进入阅读
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {activeTab === "chapters" && (
          <div className="space-y-4">
            {/* 总进度概览 */}
            <div className="bg-gradient-to-r from-[#E85D04]/10 to-[#C9A961]/10 rounded-xl p-4 border border-[#C9A961]/15">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#2D2D2D]">阅读进度</span>
                <span className="text-xs text-[#E85D04] font-medium">0 / {book.chapters.length} 天</span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full w-0 bg-gradient-to-r from-[#E85D04] to-[#C9A961] rounded-full" />
              </div>
              <p className="text-xs text-gray-500 mt-2">建议每天阅读一章，7天完成本书</p>
            </div>

            {/* 每日阅读计划 */}
            <div className="space-y-4">
              {book.chapters.map((ch) => {
                // 解析获取页码范围
                let pageRange = "";
                try {
                  const contentData = JSON.parse(ch.content || "{}");
                  pageRange = contentData.pageRange || "";
                } catch {
                  pageRange = "";
                }
                
                const insightCount = chapterInsights[ch.id] || 0;
                const hasInsight = insightCount > 0;
                
                return (
                  <Link href={`/book/${book.id}/chapter/${ch.id}`} key={ch.id}>
                    <div className={`bg-white rounded-xl border p-5 flex items-center gap-4 hover:shadow-md transition-all ${
                      hasInsight ? "border-[#E85D04]/30" : "border-[#C9A961]/10 hover:border-[#C9A961]/25"
                    }`}>
                      {/* Day 标识 */}
                      <div className="flex flex-col items-center min-w-[50px]">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Day</span>
                        <span className="text-2xl font-bold text-[#E85D04]">{ch.order}</span>
                      </div>
                      
                      {/* 分隔线 */}
                      <div className="w-px h-10 bg-gradient-to-b from-transparent via-[#C9A961]/30 to-transparent" />
                      
                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-bold text-[#2D2D2D] truncate leading-tight">{ch.title}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          {pageRange && (
                            <p className="text-xs text-[#C9A961]">{pageRange}</p>
                          )}
                          {hasInsight && (
                            <span className="text-[10px] text-[#E85D04] flex items-center gap-1 bg-[#E85D04]/10 px-2 py-0.5 rounded-full">
                              <span className="w-1 h-1 rounded-full bg-[#E85D04]" />
                              {insightCount}个相关提示
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* 箭头 */}
                      <ChevronRight size={18} className="text-[#C9A961]/60 flex-shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "materials" && (
          <div className="space-y-3">
            {book.materials.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">暂无学习资料</p>
            )}
            {book.materials.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-xl p-4 flex items-center justify-between border border-[#C9A961]/15"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] flex items-center justify-center">
                    <FileText size={20} className="text-[#C9A961]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2D2D2D]">{m.title}</p>
                    <p className="text-xs text-gray-400">{m.type.toUpperCase()}</p>
                  </div>
                </div>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#E85D04] font-medium px-3 py-1.5 bg-[#E85D04]/10 rounded-full"
                >
                  下载
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
