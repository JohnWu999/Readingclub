"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // onboarding、login、reading-together、child 页面不需要跳转
    if (pathname === "/onboarding" || pathname === "/login" || pathname === "/reading-together" || pathname === "/child") {
      setChecking(false);
      return;
    }

    const checkAccess = async () => {
      try {
        // 1. 检查是否已登录
        const authRes = await fetch("/api/auth/me");
        if (!authRes.ok) {
          router.push("/login");
          return;
        }

        const authData = await authRes.json();
        const userId = authData.user?.id;
        if (!userId) {
          router.push("/login");
          return;
        }

        // 存储 userId 到 localStorage
        localStorage.setItem("userId", userId);

        // 2. 检查是否已完成 onboarding
        const problemRes = await fetch(`/api/user/problem?userId=${userId}`);
        const problemData = await problemRes.json();

        if (!problemData.hasProblem) {
          // 未填写困惑，强制跳转到 onboarding
          router.push("/onboarding");
          return;
        }
      } catch (error) {
        console.error("Route guard error:", error);
      } finally {
        setChecking(false);
      }
    };

    checkAccess();
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-[#C9A961] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#3D352E]/50">正在检查登录状态...</p>
      </div>
    );
  }

  return <>{children}</>;
}
