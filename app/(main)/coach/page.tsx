"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, BookOpen, Lightbulb, Sparkles, Search, BrainCircuit, Compass } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCard?: {
    name: string;
    icon: string;
    formula: string;
    example: string;
    chapter: string;
    page: string;
  };
}

const SUGGESTIONS = [
  "孩子写作业磨蹭，我说了十遍都没用",
  "老人总是越界干预我带孩子",
  "孩子情绪崩溃大哭，我不知道怎么处理",
  "我忍不住吼了孩子，现在很后悔",
];

// AI思考步骤
const THINKING_STEPS = [
  { icon: BrainCircuit, text: "正在理解你的问题...", delay: 800 },
  { icon: Search, text: "正在书中寻找相关章节...", delay: 1200 },
  { icon: Compass, text: "正在分析合适的工具...", delay: 1000 },
  { icon: Sparkles, text: "正在整理建议...", delay: 800 },
];

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "你好，我是安心。\n\n今天和孩子之间发生了什么？你可以描述具体场景，我会帮你：\n\n1. **判断问题区** — 谁在困扰中？\n2. **推荐工具** — 积极倾听？我信息？第三法？\n3. **给话术** — 你现在可以怎么说\n\n试试描述一个让你头疼的场景 👇",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText, thinkingStep]);

  // 打字机效果
  const typeText = async (text: string, speed: number = 30) => {
    setShowTyping(true);
    setTypingText("");
    
    for (let i = 0; i < text.length; i++) {
      setTypingText(text.slice(0, i + 1));
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    setShowTyping(false);
    setTypingText("");
    return text;
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setThinkingStep(0);

    // 思考动画
    let currentStep = 0;
    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < THINKING_STEPS.length) {
        setThinkingStep(currentStep);
      }
    }, 1000);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: content }),
      });

      clearInterval(stepInterval);
      const data = await res.json();

      // 渐入显示思考完成，开始打字
      setThinkingStep(THINKING_STEPS.length);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 打字机效果显示答案
      await typeText(data.answer, 25);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        toolCard: data.toolCard,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      clearInterval(stepInterval);
      setThinkingStep(0);
      
      const fallbackText = "抱歉，我现在有点忙，请稍后再试。";
      await typeText(fallbackText, 30);
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fallbackText,
        },
      ]);
    } finally {
      setLoading(false);
      setThinkingStep(0);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] flex flex-col">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur border-b border-[#C9A961]/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-8 h-8 rounded-full bg-white border border-[#C9A961]/20 flex items-center justify-center text-gray-400 hover:text-[#E85D04] transition-colors"
          >
            <span className="text-sm">←</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold text-[#2D2D2D]">安心教练</h1>
            <p className="text-[11px] text-gray-400">基于《在远远的背后带领》</p>
          </div>
          <Link href="/book/book-1" className="text-[#C9A961] hover:text-[#E85D04]">
            <BookOpen size={20} />
          </Link>
        </div>
      </header>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "user"
                  ? "bg-[#E85D04]/10"
                  : "bg-gradient-to-br from-[#E85D04] to-[#C9A961]"
              }`}
            >
              {msg.role === "user" ? (
                <User size={16} className="text-[#E85D04]" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-[1.8] ${
                msg.role === "user"
                  ? "bg-[#E85D04] text-white"
                  : "bg-white border border-[#C9A961]/10 text-[#4A4A4A]"
              }`}
            >
              <div className="whitespace-pre-line">{msg.content}</div>
              
              {/* 工具卡片 */}
              {msg.toolCard && (
                <div className="mt-4 pt-3 border-t border-[#C9A961]/10">
                  <div className="bg-[#FAF7F2] rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{msg.toolCard.icon}</span>
                      <span className="text-sm font-bold text-[#E85D04]">{msg.toolCard.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{msg.toolCard.formula}</p>
                    <div className="bg-white rounded-lg p-2 text-xs text-gray-600 italic border border-[#C9A961]/10">
                      例：{msg.toolCard.example}
                    </div>
                    <p className="text-[10px] text-[#C9A961] mt-2">
                      出处：{msg.toolCard.chapter} {msg.toolCard.page}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 思考中动画 */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E85D04] to-[#C9A961] flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-[#C9A961]/10 rounded-2xl px-4 py-3 min-w-[200px]">
              {thinkingStep < THINKING_STEPS.length ? (
                <div className="space-y-2">
                  {THINKING_STEPS.map((step, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-xs transition-all duration-500 ${
                        i <= thinkingStep
                          ? "text-[#E85D04] opacity-100"
                          : "text-gray-300 opacity-40"
                      }`}
                    >
                      <step.icon size={14} className={i <= thinkingStep ? "animate-pulse" : ""} />
                      <span>{step.text}</span>
                      {i < thinkingStep && (
                        <span className="text-[#C9A961] text-[10px]">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-[#4A4A4A] whitespace-pre-line leading-[1.8]">
                  {typingText}
                  <span className="inline-block w-0.5 h-4 bg-[#E85D04] ml-0.5 animate-pulse align-middle" />
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* 快捷建议 */}
      {messages.length === 1 && (
        <div className="px-4 pb-3">
          <p className="text-[11px] text-gray-400 mb-3 flex items-center gap-1">
            <Lightbulb size={11} />
            常见场景
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="text-xs bg-white border border-[#C9A961]/20 rounded-full px-3 py-1.5 text-[#5C5C5C] hover:border-[#E85D04]/40 hover:text-[#E85D04] transition-colors"
              >
                {s.length > 12 ? s.slice(0, 12) + "..." : s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 输入框 */}
      <div className="px-4 py-3 bg-white border-t border-[#C9A961]/10">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="描述你今天遇到的情况..."
            className="flex-1 min-h-[44px] max-h-[120px] p-3 rounded-xl border border-[#C9A961]/20 bg-[#FAF7F2] text-sm resize-none focus:outline-none focus:border-[#C9A961]"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl bg-[#E85D04] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-gray-300 text-center mt-2">
          AI 建议基于《在远远的背后带领》，仅供参考
        </p>
      </div>
    </main>
  );
}
