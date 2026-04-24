"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, Edit3, ArrowRight, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [problems, setProblems] = useState(["", "", ""]);
  const [childInfo, setChildInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 加载已有数据
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setFetching(false);
      return;
    }

    fetch(`/api/user/problem?userId=${userId}`)
      .then(r => r.json())
      .then(data => {
        if (data.hasProblem) {
          setProblems(data.problems.concat(["", ""]).slice(0, 3));
          if (data.childInfo) setChildInfo(data.childInfo);
          setIsEdit(true);
        }
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, []);

  // 自动保存草稿（step 1 点继续时）
  const saveDraft = async () => {
    const validProblems = problems.filter(p => p.trim().length > 0);
    if (validProblems.length === 0) return;

    const userId = localStorage.getItem("userId") || "guest-" + Date.now();
    localStorage.setItem("userId", userId);

    try {
      await fetch("/api/user/problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          problems: validProblems,
          childInfo: childInfo.trim() || undefined
        })
      });
    } catch (error) {
      console.error("Draft save error:", error);
    }
  };

  const handleContinue = async () => {
    await saveDraft();
    setStep(2);
  };

  const handleSubmit = async () => {
    const validProblems = problems.filter(p => p.trim().length > 0);
    if (validProblems.length === 0) return;

    setLoading(true);
    
    const userId = localStorage.getItem("userId") || "guest-" + Date.now();
    
    try {
      const res = await fetch("/api/user/problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          problems: validProblems,
          childInfo: childInfo.trim() || undefined
        })
      });

      if (res.ok) {
        localStorage.setItem("userId", userId);
        router.push("/book/book-1");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="animate-pulse text-[#C9A961]">加载中...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* 顶部返回 */}
        <div className="mb-6">
          <Link href="/me" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#E85D04]">
            <ArrowLeft size={16} />
            返回我的
          </Link>
        </div>

        {/* 进度指示器 */}
        <div className="flex gap-2 mb-8">
          {[1, 2].map(i => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-[#E85D04]" : "bg-[#E85D04]/20"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E85D04]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-[#E85D04]" />
              </div>
              <h1 className="text-2xl font-bold text-[#3D352E] mb-2">
                {isEdit ? "更新你的困惑" : "欢迎来到犟爸书房"}
              </h1>
              <p className="text-[#3D352E]/60">
                {isEdit ? "随时可以修改，AI会根据新的困惑重新匹配" : "读书之前，我想先了解你"}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#3D352E] mb-4">
                最让你困扰的1-3个问题
              </h2>
              <p className="text-sm text-[#3D352E]/60 mb-4">
                可以是育儿困惑、家庭关系、或任何持续一年以上的烦恼
              </p>

              <div className="space-y-3">
                {problems.map((problem, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute left-3 top-3 text-[#C9A961] font-medium">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={problem}
                      onChange={e => {
                        const newProblems = [...problems];
                        newProblems[idx] = e.target.value;
                        setProblems(newProblems);
                      }}
                      placeholder={
                        idx === 0 ? "例如：孩子写作业总是磨蹭，我说十遍都没用" :
                        idx === 1 ? "例如：老人总是越界干预我带孩子" :
                        "第三个问题（可选）"
                      }
                      className="w-full pl-8 pr-4 py-3 bg-[#FAF7F2] rounded-xl text-[#3D352E] placeholder:text-[#3D352E]/40 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/30"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-[#C9A961]/30 rounded-xl text-[#C9A961]">
                  <Mic size={18} />
                  <span className="text-sm">语音输入</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-[#C9A961]/30 rounded-xl text-[#C9A961]">
                  <Edit3 size={18} />
                  <span className="text-sm">手动输入</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={problems[0].trim().length === 0}
              className="w-full py-4 bg-[#E85D04] text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              继续
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#3D352E] mb-2">
                孩子的基本情况
              </h2>
              <p className="text-[#3D352E]/60">
                这将帮助AI为你提供更精准的建议
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <textarea
                value={childInfo}
                onChange={e => setChildInfo(e.target.value)}
                placeholder="例如：女孩，8岁，上小学二年级，性格活泼好动，但座不住..."
                rows={6}
                className="w-full p-4 bg-[#FAF7F2] rounded-xl text-[#3D352E] placeholder:text-[#3D352E]/40 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/30 resize-none"
              />
              <p className="text-xs text-[#3D352E]/40 mt-2">
                * 不愿意填写可以直接跳过
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 border-2 border-[#E85D04] text-[#E85D04] rounded-xl font-medium"
              >
                返回
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-4 bg-[#E85D04] text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "保存中..." : isEdit ? "保存修改" : "开始阅读"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </div>
        )}

        {/* 说明文字 */}
        <p className="text-center text-xs text-[#3D352E]/40 mt-8">
          你的困惑将与你的账号绑定，AI会在阅读过程中<br/>
          为你找到书中与之相关的内容提示
        </p>
      </div>
    </main>
  );
}
