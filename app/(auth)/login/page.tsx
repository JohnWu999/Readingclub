"use client";

import { useState } from "react";
import { BookOpen, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError("请输入正确的手机号");
      return;
    }
    if (!password || password.length < 6) {
      setError("密码至少6位");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/me");
      } else {
        setError(data.error || "登录失败");
      }
    } catch (e) {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError("请输入正确的手机号");
      return;
    }
    if (!password || password.length < 6) {
      setError("密码至少6位");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // 注册成功，先跳转到困惑录入页
        router.push("/onboarding");
      } else {
        setError(data.error || "注册失败");
      }
    } catch (e) {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
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

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">密码</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码（至少6位）"
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-[#FAF7F2] text-sm outline-none placeholder:text-gray-300 border border-transparent focus:border-[#E85D04]/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#E85D04] text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? "登录中..." : "登录"}
              <ArrowRight size={16} />
            </button>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-white text-[#E85D04] border border-[#E85D04] text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? "处理中..." : "注册新账号"}
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
