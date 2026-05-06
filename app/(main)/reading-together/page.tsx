"use client";

import { useState, useRef, useEffect } from "react";
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
  Send,
  X,
  Loader2,
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
    active: false,
  },
  {
    id: "together",
    title: "AI 伴读",
    subtitle: "同桌共读",
    desc: "AI 也在读这本书，页边有批注，随时可讨论。",
    icon: MessageCircle,
    color: "#E85D04",
    active: true,
  },
  {
    id: "ai-first",
    title: "让 AI 先读",
    subtitle: "预习模式",
    desc: "AI 提前读完，生成精华地图 + 提问清单，降低门槛。",
    icon: Sparkles,
    color: "#C9A961",
    active: false,
  },
];

const aiCompanionTraits = [
  { icon: Heart, label: "共情", desc: "理解你的育儻焦虑" },
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

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  toolCard?: { name: string; page: string };
}

export default function ReadingTogetherPage() {
  const [selectedMode, setSelectedMode] = useState("together");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg.content }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: data.answer || "抱歉，我暂时无法回复。",
          toolCard: data.toolCard
            ? { name: data.toolCard.name, page: data.toolCard.page }
            : undefined,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "服务暂时不可用，请稍后重试。" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "网络异常，请检查网络后重试。" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startChatFromAnnotation = (note: string) => {
    setChatOpen(true);
    setMessages([
      {
        role: "assistant",
        content: note + "\n\n你想跟我讨论这一段吗？或者有什么其他问题想聊？",
      },
    ]);
  };

  // 禁用背景滚动当弹窗打开
  useEffect(() => {
    if (chatOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.dataset.scrollY = String(scrollY);
    } else {
      document.body.style.overflow = "";
      const scrollY = document.body.dataset.scrollY;
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
        delete document.body.dataset.scrollY;
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [chatOpen]);

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
        <p className="text-sm text-gray-500 ml-10">不是问答，是和你一起读书</p>
      </div>

      {/* 三种阅读模式 */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-[#2D2D2D] mb-4">选择阅读方式</h2>
        <div className="space-y-3">
          {readingModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
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
                        style={{ color: isSelected ? mode.color : "#2D2D2D" }}
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

      {/* AI 伴读批注 + 聊天入口 */}
      {selectedMode === "together" && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#2D2D2D]">AI 伴读</h2>
            <span className="text-[10px] px-2 py-1 rounded-full bg-[#E85D04]/10 text-[#E85D04]">
              实时对话
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
                    <p className="text-xs text-[#C9A961] italic">{anno.quote}</p>
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
                  <button
                    onClick={() => startChatFromAnnotation(anno.aiNote)}
                    className="mt-2 text-[11px] text-[#E85D04] font-medium flex items-center gap-1 ml-8"
                  >
                    <MessageCircle size={12} />
                    讨论这段
                  </button>
                </div>
              ))}
            </div>

            {/* 底部操作 */}
            <div className="px-4 py-3 border-t border-gray-100">
              <button
                onClick={() => {
                  setChatOpen(true);
                  if (messages.length === 0) {
                    setMessages([
                      {
                        role: "assistant",
                        content:
                          "你好！我是安心，今天我们一起读《在远远的背后带领》。\n\n你可以问我任何问题，或者告诉我你最近在育儻中遇到的困扰。",
                      },
                    ]);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-[#E85D04] text-white text-sm font-medium flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                开始和 AI 讨论
              </button>
            </div>
          </div>
        </section>
      )}

      {/* AI 分身介绍 */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-[#2D2D2D] mb-4">你的 AI 阅读分身</h2>
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
                <h3 className="text-sm font-bold text-[#2D2D2D]">{trait.label}</h3>
                <p className="text-[11px] text-gray-500 mt-1">{trait.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 角色扮演 */}
      <section className="mb-8">
        <div className="bg-gradient-to-br from-[#E85D04]/5 to-[#C9A961]/10 rounded-2xl p-5 border border-[#C9A961]/15">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-[#E85D04]" />
            <h2 className="text-base font-bold text-[#2D2D2D]">角色扮演练习</h2>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mb-4">
            读《正面管教》时，让 AI 扮演一个哭闹的 5
            岁孩子，你试着用书中的方法回应。AI 会给你实时反馈。
          </p>
          <div className="flex gap-3 mb-4">
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
          <button
            onClick={() => {
              setChatOpen(true);
              setMessages([
                {
                  role: "assistant",
                  content:
                    "你好，我是你的孩子。我今天不想写作业，我想玩游戏！（哭）\n\n你会怎么回应我？试试用《正面管教》里学到的方法。",
                },
              ]);
            }}
            className="w-full py-2.5 rounded-xl bg-white border border-[#E85D04]/30 text-[#E85D04] text-sm font-medium flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            开始角色扮演
          </button>
        </div>
      </section>

      {/* 聊天弹窗 */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center"
             style={{ touchAction: 'manipulation' }}>
          <div className="bg-white w-full max-w-lg sm:rounded-2xl rounded-t-2xl h-[85dvh] sm:h-[600px] flex flex-col overflow-hidden"
               style={{ maxHeight: 'calc(100dvh - 20px)' }}>
            {/* 头部 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E85D04] to-[#C9A961] flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2D2D2D]">安心</p>
                  <p className="text-[10px] text-gray-400">AI 共读伴侣</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200"
                style={{ touchAction: 'manipulation' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* 消息列表 */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0"
            >
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot size={40} className="text-[#C9A961] mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    点击下方按钮开始对话
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "user"
                        ? "bg-[#E85D04]"
                        : "bg-gradient-to-br from-[#E85D04] to-[#C9A961]"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User size={14} className="text-white" />
                    ) : (
                      <Bot size={14} className="text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#E85D04] text-white rounded-tr-sm"
                        : "bg-[#FAF7F2] text-[#4A4A4A] rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                    {msg.toolCard && (
                      <div className="mt-2 pt-2 border-t border-[#C9A961]/20">
                        <p className="text-[10px] text-[#C9A961]">
                          📖 {msg.toolCard.name} {msg.toolCard.page}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E85D04] to-[#C9A961] flex items-center justify-center">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-[#FAF7F2] rounded-2xl rounded-tl-sm px-3 py-2">
                    <Loader2 size={16} className="text-[#C9A961] animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* 输入框 */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white shrink-0"
                 style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="问安心一个问题..."
                  autoComplete="off"
                  inputMode="text"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/30 min-w-0"
                  style={{ touchAction: 'manipulation' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-[#E85D04] text-white flex items-center justify-center disabled:opacity-50 shrink-0 active:bg-[#d45404]"
                  style={{ touchAction: 'manipulation' }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 底部 CTA */}
      {!chatOpen && (
        <div className="sticky bottom-0 -mx-5 px-5 py-3 bg-white/90 backdrop-blur border-t border-[#C9A961]/10">
          <button
            onClick={() => {
              setChatOpen(true);
              if (messages.length === 0) {
                setMessages([
                  {
                    role: "assistant",
                    content:
                      "你好！我是安心，今天我们一起读《在远远的背后带领》。\n\n你可以问我任何问题，或者告诉我你最近在育儻中遇到的困扰。",
                  },
                ]);
              }
            }}
            className="w-full py-3 rounded-xl bg-[#E85D04] text-white text-sm font-medium shadow-sm"
          >
            开始 AI 共读
          </button>
        </div>
      )}
    </main>
  );
}
