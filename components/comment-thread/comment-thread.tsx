"use client";

import { useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";

interface Comment {
  id: string;
  user: { name: string; avatar: string };
  content: string;
  time: string;
  likes: number;
  replies: Comment[];
}

interface CommentThreadProps {
  comments: Comment[];
}

export default function CommentThread({ comments }: CommentThreadProps) {
  const [newComment, setNewComment] = useState("");

  return (
    <div className="space-y-4">
      {/* 发帐输入框 */}
      <div className="bg-white rounded-xl p-3 border border-[#C9A961]/15 flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="分享你的阅读感受..."
          className="flex-1 text-sm outline-none placeholder:text-gray-300"
        />
        <button className="w-8 h-8 rounded-full bg-[#E85D04] text-white flex items-center justify-center flex-shrink-0">
          <Send size={14} />
        </button>
      </div>

      {/* 评论列表 */}
      {comments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">还没有讨论，来写下第一条吧~</p>
        </div>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-xl p-4 border border-[#C9A961]/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E85D04]/30 to-[#C9A961]/30 flex items-center justify-center text-xs font-bold text-[#E85D04]">
                {comment.user.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-[#2D2D2D]">{comment.user.name}</p>
                <p className="text-[10px] text-gray-400">{comment.time}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{comment.content}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#E85D04]">
                <Heart size={14} />
                {comment.likes}
              </button>
              <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#E85D04]">
                <MessageCircle size={14} />
                回复
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
