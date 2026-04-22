import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "犟爸读书会",
  description: "在远远的背后带领——读书，照见自己；情绪，滋养关系。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
