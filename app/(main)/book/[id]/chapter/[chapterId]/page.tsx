import { ChevronLeft, MessageCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import ChapterContent from "@/components/chapter-content/chapter-content";
import ReadingGuideContent from "@/components/reading-guide-content";
import CommentThread from "@/components/comment-thread/comment-thread";
import { prisma } from "@/lib/prisma";

interface ChapterPageProps {
  params: Promise<{ id: string; chapterId: string }>;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { id: bookId, chapterId } = await params;

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: {
      book: { select: { id: true, title: true } },
      materials: true,
    },
  });

  if (!chapter) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <p className="text-gray-500">章节不存在</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-xl mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-sm border-b border-[#C9A961]/10">
          <div className="flex items-center gap-3 px-5 py-3">
            <Link
              href={`/book/${bookId}`}
              className="w-8 h-8 rounded-full bg-white border border-[#C9A961]/20 flex items-center justify-center text-gray-500 hover:text-[#E85D04] transition-colors"
            >
              <ChevronLeft size={18} />
            </Link>
            <div className="flex-1 min-w-0 text-center">
              <p className="text-xs text-[#C9A961] truncate">{chapter.book.title}</p>
            </div>
            <div className="w-8" />
          </div>
        </div>

        {/* 章节头部 */}
        <header className="px-4 pt-6 pb-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-[#E85D04]/10 text-[#E85D04] text-[11px] font-medium mb-2">
            Day {chapter.order}
          </span>
          <h1 className="text-xl font-bold text-[#2D2D2D] leading-tight tracking-wide">
            {chapter.title}
          </h1>
          {chapter.summary && (
            <p className="mt-2 text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
              {chapter.summary}
            </p>
          )}
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-[#C9A961]/25" />
            <div className="w-1 h-1 rounded-full bg-[#C9A961]/40" />
            <div className="h-px w-10 bg-[#C9A961]/25" />
          </div>
        </header>

        {/* 章节正文 */}
        <section className="px-4 pb-8">
          {chapter.content ? (
            (() => {
              const isJson = chapter.content.trim().startsWith("{");
              return isJson ? (
                <ReadingGuideContent content={chapter.content} />
              ) : (
                <ChapterContent content={chapter.content} />
              );
            })()
          ) : (
            <div className="text-center py-16">
              <BookOpen size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">暂无正文内容</p>
            </div>
          )}
        </section>

        {/* 章末装饰 */}
        <div className="flex items-center justify-center gap-3 pb-8">
          <div className="h-px w-16 bg-[#C9A961]/20" />
          <span className="text-xs text-[#C9A961]/60">本章完</span>
          <div className="h-px w-16 bg-[#C9A961]/20" />
        </div>

        <div className="px-4 pb-24">
          {/* 讨论区 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle size={18} className="text-[#E85D04]" />
              <h2 className="text-base font-bold text-[#2D2D2D]">讨论区</h2>
            </div>
            <div className="bg-white rounded-2xl border border-[#C9A961]/10 shadow-sm">
              <CommentThread chapterId={chapterId} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
