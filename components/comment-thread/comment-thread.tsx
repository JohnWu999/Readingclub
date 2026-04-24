"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";

interface CommentItem {
  id: string;
  user: { id: string; nickname: string | null; avatar: string | null };
  content: string;
  createdAt: string;
  likes?: number;
  replies?: CommentItem[];
}

interface CommentThreadProps {
  comments?: CommentItem[];
  bookId?: string;
  chapterId?: string;
}

export default function CommentThread({
  comments: propComments,
  bookId,
  chapterId,
}: CommentThreadProps) {
  const [allComments, setAllComments] = useState<CommentItem[]>(propComments || []);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (propComments) {
      setAllComments(propComments);
      return;
    }
    // Fetch comments from API
    const url = chapterId
      ? `/api/comments?chapterId=${chapterId}`
      : bookId
      ? `/api/comments?bookId=${bookId}`
      : null;
    if (!url) return;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.comments) setAllComments(data.comments);
      })
      .catch(console.error);
  }, [propComments, bookId, chapterId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment.trim(),
          chapterId,
        }),
      });
      if (res.ok) {
        setNewComment("");
        setMessage("发表成功！");
        // Refresh comments
        const url = chapterId
          ? `/api/comments?chapterId=${chapterId}`
          : bookId
          ? `/api/comments?bookId=${bookId}`
          : null;
        if (url) {
          fetch(url)
            .then((r) => r.json())
            .then((data) => {
              if (data.comments) setAllComments(data.comments);
            });
        }
      } else if (res.status === 401) {
        setMessage("请先登录后发表");
      } else {
        setMessage("发表失败，请重试");
      }
    } catch (e) {
      setMessage("发表失败，请重试");
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className="text-center text-sm text-[#E85D04] bg-[#E85D04]/10 py-2 rounded-lg">
          {message}
        </div>
      )}

      {/* 发言输入框 */}
      <div className="bg-white rounded-xl p-3 border border-[#C9A961]/15 flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="分享你的阅读感受..."
          className="flex-1 text-sm outline-none placeholder:text-gray-300"
        />
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-8 h-8 rounded-full bg-[#E85D04] text-white flex items-center justify-center flex-shrink-0 disabled:opacity-50"
        >
          <Send size={14} />
        </button>
      </div>

      {/* 评论列表 */}
      {allComments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">还没有讨论，来写下第一条吧~</p>
        </div>
      ) : (
        allComments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white rounded-xl p-4 border border-[#C9A961]/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E85D04]/30 to-[#C9A961]/30 flex items-center justify-center text-xs font-bold text-[#E85D04]">
                {(comment.user.nickname || "用户").charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-[#2D2D2D]">
                  {comment.user.nickname || "用户"}
                </p>
                <p className="text-[10px] text-gray-400">
                  {formatTime(comment.createdAt)}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              {comment.content}
            </p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#E85D04]">
                <Heart size={14} />
                {comment.likes || 0}
              </button>
              <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#E85D04]">
                <MessageCircle size={14} />
                回复
              </button>
            </div>

            {/* 回复列表 */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 pl-3 border-l-2 border-[#C9A961]/20 space-y-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="text-xs text-gray-500">
                    <span className="font-medium text-[#2D2D2D]">
                      {reply.user.nickname || "用户"}
                    </span>
                    ：{reply.content}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
