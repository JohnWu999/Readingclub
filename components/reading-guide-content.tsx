"use client";

import { useState, useEffect, useCallback } from "react";
import { Quote, BookOpen, Headphones, MessageSquare, Bookmark, ChevronRight, Sparkles, Lightbulb, ChevronDown } from "lucide-react";

// ===== 类型定义 =====
interface QuoteItem {
  text: string;
  source: string;
}

interface MindmapItem {
  chapter: string;
  sections: string[];
}

interface CaseItem {
  title: string;
  content: string;
}

interface BookRec {
  name: string;
  author: string;
  description: string;
}

interface ReadingGuideData {
  dayLabel: string;
  theme: string;
  pageRange: string;
  intro: {
    topic: string;
    description?: string;
    questions: string[];
  };
  audio?: {
    title: string;
    url?: string;
    duration?: string;
    placeholder?: boolean;
  };
  quotes?: QuoteItem[];
  outline?: { title: string; items: string[] }[];
  cases?: CaseItem[];
  reflection?: { question: string }[] | { questions: string[] };
  recommendedReading?: {
    title: string;
    books: BookRec[];
  };
  materials?: {
    quotes?: QuoteItem[];
    mindmap?: MindmapItem[];
    outline?: { title: string; items: string[] }[];
    cases?: CaseItem[];
  };
}

interface ReadingGuideContentProps {
  content: string;
}

// ===== 音频播放器 =====
function AudioPlayer({ audio }: { audio?: ReadingGuideData["audio"] }) {
  const [speed, setSpeed] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!audio) return null;
  const speeds = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  return (
    <div className="bg-white rounded-xl border border-[#C9A961]/10 p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#E85D04]/10 flex items-center justify-center">
          <Headphones size={18} className="text-[#E85D04]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#2D2D2D] truncate">{audio.title}</p>
          {audio.duration && <p className="text-[11px] text-gray-400 mt-0.5">时长 {audio.duration}</p>}
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-9 h-9 rounded-full bg-[#E85D04] flex items-center justify-center text-white hover:bg-[#d45404] transition-colors flex-shrink-0"
        >
          {isPlaying ? <span className="text-[10px]">II</span> : <ChevronRight size={16} className="ml-0.5" />}
        </button>
      </div>
      <div className="w-full h-1 bg-gray-100 rounded-full mb-3">
        <div className="w-0 h-full bg-[#E85D04] rounded-full" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-gray-400">倍速</span>
        <div className="flex gap-1 flex-wrap">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                speed === s ? "bg-[#E85D04] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== 手风琴章节大纲 =====
function ChapterAccordion({ chapter, sections }: { chapter: string; sections: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[#C9A961]/10 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3.5 text-left hover:bg-[#FAF7F2] transition-colors"
      >
        <h5 className="text-sm font-bold text-[#E85D04] flex items-center gap-1.5">
          <Sparkles size={12} className="text-[#C9A961]" />
          {chapter}
        </h5>
        <ChevronDown
          size={16}
          className={`text-[#C9A961] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <ul className="px-3.5 pb-3.5 space-y-1">
          {sections.map((sub, j) => (
            <li key={j} className="text-sm text-[#4A4A4A] leading-relaxed flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-[#C9A961]/50 mt-2 flex-shrink-0" />
              <span>{sub}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ===== 反思输入 =====
function ReflectionInput({ question, index }: { question: string; index: number }) {
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);
  const storageKey = `reflection-ch1-q${index}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) { setValue(saved); setSaved(true); }
  }, [storageKey]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    localStorage.setItem(storageKey, newValue);
    setSaved(newValue.length > 0);
  }, [storageKey]);

  return (
    <div className="bg-[#FAF7F2] rounded-xl p-4">
      <div className="flex items-start gap-2.5 mb-3">
        <div className="w-6 h-6 rounded-full bg-[#C9A961]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <MessageSquare size={12} className="text-[#C9A961]" />
        </div>
        <p className="text-sm text-[#5C5C5C] leading-[1.7]">{question}</p>
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="写下你的想法..."
        className="w-full min-h-[80px] p-3 rounded-lg border border-[#C9A961]/15 bg-white text-sm text-[#4A4A4A] placeholder:text-gray-300 resize-none focus:outline-none focus:border-[#C9A961]/40 transition-colors leading-[1.7]"
      />
      {saved && (
        <p className="text-[11px] text-[#C9A961] mt-2 flex items-center gap-1">
          <Bookmark size={11} />已自动保存到本地
        </p>
      )}
    </div>
  );
}

// ===== 主组件 =====
export default function ReadingGuideContent({ content }: ReadingGuideContentProps) {
  const [data, setData] = useState<ReadingGuideData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try { setData(JSON.parse(content)); }
    catch { setError(true); }
  }, [content]);

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <BookOpen size={40} className="text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-400">内容格式错误</p>
      </div>
    );
  }
  // 数据兼容：旧版直接存 quotes/cases/reflection，新版嵌套在 materials 下
  const quotes = data.quotes || data.materials?.quotes || [];
  // mindmap：旧版用 data.outline，新版用 data.materials?.mindmap
  const mindmap = data.materials?.mindmap || [];
  const cases = data.cases || data.materials?.cases || [];
  // outline：内容纲要（P.E.T.简介、四大核心等），只在新版 materials 中
  const contentOutline = data.materials?.outline || [];
  const reflectionQuestions = Array.isArray(data.reflection)
    ? data.reflection.map((r) => r.question)
    : data.reflection?.questions || [];

  return (
    <div className="space-y-7">
      {/* 页码提示 */}
      <div className="text-center">
        <span className="text-[11px] text-[#C9A961]/60 tracking-wider">{data.pageRange}</span>
      </div>

      {/* 阅读引言 */}
      <section className="bg-white rounded-xl border border-[#C9A961]/10 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={16} className="text-[#E85D04]" />
          <h3 className="text-sm font-bold text-[#2D2D2D]">今日阅读焦点</h3>
        </div>
        <p className="text-sm text-[#5C5C5C] leading-[1.8] mb-4">{data.intro.topic}</p>
        {data.intro.description && (
          <p className="text-sm text-[#6B6B6B] leading-[1.8] mb-5">{data.intro.description}</p>
        )}
        <div className="space-y-3">
          {data.intro.questions.map((q, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#C9A961]/10 flex items-center justify-center text-[10px] text-[#C9A961] font-bold flex-shrink-0 mt-0.5">
                Q{i + 1}
              </span>
              <p className="text-sm text-[#5C5C5C] leading-[1.7]">{q}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 音频导览 */}
      {data.audio && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Headphones size={16} className="text-[#E85D04]" />
            <h3 className="text-sm font-bold text-[#2D2D2D]">音频导览</h3>
          </div>
          <AudioPlayer audio={data.audio} />
        </section>
      )}

      {/* 学习材料 */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-[#C9A961]" />
          <h3 className="text-sm font-bold text-[#2D2D2D]">学习材料</h3>
        </div>

        <div className="space-y-5">
          {/* 金句 */}
          {quotes.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">金句摘录</h4>
              <div className="space-y-3">
                {quotes.map((q, i) => (
                  <blockquote key={i} className="pl-3.5 border-l-[2px] border-[#C9A961] py-1">
                    <div className="flex items-start gap-2">
                      <Quote size={12} className="text-[#C9A961] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[15px] text-[#5C4A32] leading-[1.7] font-medium">{q.text}</p>
                        <p className="text-[11px] text-gray-400 mt-2">{q.source}</p>
                      </div>
                    </div>
                  </blockquote>
                ))}
              </div>
            </div>
          )}

          {/* 内容纲要（P.E.T.简介、四大核心、行为窗口等） */}
          {contentOutline.length > 0 && (
            <div>
              <h4 className="text-xs text-gray-400 mb-3 uppercase tracking-wider">内容纲要</h4>
              <div className="bg-white rounded-xl border border-[#C9A961]/10 p-4 shadow-sm">
                <div className="space-y-3">
                  {contentOutline.map((item, i) => (
                    <div key={i} className={i < contentOutline.length - 1 ? "pb-3 border-b border-[#C9A961]/10" : ""}>
                      <h5 className="text-sm font-bold text-[#E85D04] mb-1.5 flex items-center gap-1.5">
                        <Sparkles size={12} className="text-[#C9A961]" />
                        {item.title}
                      </h5>
                      <ul className="space-y-1">
                        {item.items.map((sub: string, j: number) => (
                          <li key={j} className="text-sm text-[#4A4A4A] leading-relaxed flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#C9A961]/50 mt-2 flex-shrink-0" />
                            <span>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 章节大纲 - 手风琴 */}
          {mindmap.length > 0 && (
            <div>
              <h4 className="text-xs text-gray-400 mb-2.5 uppercase tracking-wider">章节大纲</h4>
              <div className="space-y-2.5">
                {mindmap.map((item, i) => (
                  <ChapterAccordion key={i} chapter={item.chapter} sections={item.sections} />
                ))}
              </div>
            </div>
          )}

          {/* 案例分析 */}
          {cases.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">案例与思考</h4>
              <div className="space-y-4">
                {cases.map((c, i) => (
                  <div key={i} className="bg-[#FAF7F2] rounded-xl p-4">
                    <h5 className="text-sm font-bold text-[#2D2D2D] mb-3 flex items-center gap-1.5">
                      <Lightbulb size={12} className="text-[#E85D04]" />
                      {c.title}
                    </h5>
                    <p className="text-sm text-[#6B6B6B] leading-[1.8]">{c.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 今日反思 */}
      {reflectionQuestions.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={16} className="text-[#E85D04]" />
            <h3 className="text-sm font-bold text-[#2D2D2D]">今日反思</h3>
          </div>
          <div className="space-y-3">
            {reflectionQuestions.map((q, i) => (
              <ReflectionInput key={i} question={q} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* 推荐阅读 */}
      {data.recommendedReading && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Bookmark size={16} className="text-[#C9A961]" />
            <h3 className="text-sm font-bold text-[#2D2D2D]">{data.recommendedReading.title}</h3>
          </div>
          <div className="space-y-2.5">
            {data.recommendedReading.books.map((book, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#C9A961]/10 p-3.5 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen size={12} className="text-[#C9A961]" />
                  <span className="text-sm font-bold text-[#2D2D2D]">{book.name}</span>
                </div>
                <p className="text-[11px] text-gray-400 mb-1.5">{book.author}</p>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">{book.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
