import BottomNav from "@/components/bottom-nav";
import RouteGuard from "@/components/route-guard";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FAF7F2] relative pb-20">
      <RouteGuard>
        {children}
      </RouteGuard>
      <BottomNav />
    </div>
  );
}
