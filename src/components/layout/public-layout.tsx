"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* 极简顶部导航 */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
          >
            SpringLament
          </Link>
          <Link
            href="/admin"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            管理
          </Link>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>

      {/* 极简底部 */}
      <footer className="border-t border-gray-100 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2024 SpringLament Blog</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
