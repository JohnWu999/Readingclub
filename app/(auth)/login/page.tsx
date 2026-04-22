"use client";

import { useState } from "react";
import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendCode = () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) return;
    setSending(true);
    // TODO: 调用 API 发送验证码
    setTimeout(() => setSending(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      {/* 顶部装饰 */}
      <div className="h-48 bg-gradient-to-b from-[#E85D04]/10 to-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#E85D04] text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen size={32} />
          </div>
          <h1 className="text-xl font-bold text-[#2D2D2D]">犟爸书房</h1>
          <p className="text-sm text-gray-500 mt-1">读书 · 阅己</p>
        </div>
      </div>

      {/* 登录表单 */}
      <div className="flex-1 px-6 pt-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#C9A961]/15">
          <h2 className="text-lg font-bold text-[#2D2D2D] mb-6">手机号登录</h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">手机号</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
                maxLength={11}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] text-sm outline-none placeholder:text-gray-300 border border-transparent focus:border-[#E85D04]/30 transition-colors"
              />
            </div>

            <button
              onClick={handleSendCode}
              disabled={!/^1[3-9]\d{9}$/.test(phone) || sending}
              className="w-full py-3.5 rounded-xl bg-[#E85D04] text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {sending ? "发送中..." : "获取验证码"}
              <ArrowRight size={16} />
            </button>
          </div>

          <p className="text-[10px] text-gray-400 text-center mt-4">
            登录即表示同意《用户协议》和《隐私政策》
          </p>
        </div>
      </div>
    </div>
  );
}
