import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI法考案例分析助手",
  description: "基于DeepSeek-R1的智能法律案例分析工具，为法考考生提供案例智能分析、思维链展示、智能出题和错题解析功能。",
  keywords: ["法考", "法律职业资格考试", "AI分析", "案例学习", "DeepSeek"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
