"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BookOpen, MessageSquare, ChevronRight, Sparkles, Baby } from "lucide-react";
import Link from "next/link";

interface Book {
  id: string;
  title: string;
  subtitle: string | null;
  author: string;
  description: string | null;
  coverImage: string | null;
  isActive: boolean;
  _count: { chapters: number };
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then((data) => {
        if (data.books) setBooks(data.books);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const currentBook = books.find((b) => b.isActive) || books[0];
  const pastBooks = books.filter((b) => !b.isActive);

  if (loading) {
    return (
      <main className="px-5 pt-6 pb-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-32" />
          <div className="h-40 bg-gray-200 rounded-xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="px-5 pt-8 pb-12">
      {/* 顶部标题 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2D2D2D]">犟爸书房</h1>
        <p className="text-sm text-gray-500 mt-2">读书 · 阅己</p>
      </div>

      {/* 快捷动作 */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-1">
        <Link
          href="/coach"
          className="bg-[#E85D04] text-white flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium shadow-sm flex-1 justify-center whitespace-nowrap"
        >
          <MessageSquare size={16} />
          问安心教练
        </Link>
        {currentBook && (
          <Link
            href={`/book/${currentBook.id}`}
            className="bg-white border border-[#C9A961]/30 text-[#2D2D2D] flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap"
          >
            <BookOpen size={16} className="text-[#C9A961]" />
            看书
          </Link>
        )}
        <Link
          href="/reading-together"
          className="bg-white border border-[#E85D04]/30 text-[#E85D04] flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap"
        >
          <Sparkles size={16} />
          AI共读
        </Link>
        <Link
          href="/child"
          className="bg-white border border-[#C9A961]/30 text-[#C9A961] flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap"
        >
          <Baby size={16} />
          孩子
        </Link>
      </div>

      {/* 当前书目 */}
      {currentBook && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#2D2D2D]">当前周期</h2>
            <span className="text-xs text-[#E85D04] font-medium bg-[#E85D04]/10 px-2 py-1 rounded-full">
              精读中
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#C9A961]/15">
            <div className="flex gap-5">
              <div className="relative w-24 h-36 rounded-lg overflow-hidden shadow-md flex-shrink-0 bg-gradient-to-br from-[#E85D04]/20 to-[#C9A961]/20 flex items-center justify-center">
                {currentBook.coverImage ? (
                  <Image
                    src={currentBook.coverImage}
                    alt={currentBook.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <BookOpen size={28} className="text-[#E85D04]/60" />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-[#2D2D2D] text-base leading-tight">
                    {currentBook.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">
                    {currentBook.subtitle}
                  </p>
                  <p className="text-xs text-[#C9A961] mt-2">
                    作者：{currentBook.author}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      共 {currentBook._count?.chapters || 0} 章
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                点击查看详情与章节
              </span>
              <Link
                href={`/book/${currentBook.id}`}
                className="flex items-center gap-1 text-xs text-[#E85D04] font-medium"
              >
                查看详情 <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 往期书目 */}
      {pastBooks.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-[#2D2D2D] mb-4">往期书目</h2>
          <div className="grid grid-cols-2 gap-3">
            {pastBooks.map((book) => (
              <Link href={`/book/${book.id}`} key={book.id}>
                <div className="bg-white rounded-xl p-3 shadow-sm border border-[#C9A961]/10">
                  <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden mb-2.5 bg-gradient-to-br from-[#E85D04]/10 to-[#C9A961]/10 flex items-center justify-center">
                    <BookOpen size={24} className="text-[#E85D04]/40" />
                  </div>
                  <h3 className="text-sm font-bold text-[#2D2D2D] truncate">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
