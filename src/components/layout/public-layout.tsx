"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Settings, Moon, Sun } from "lucide-react";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* 右上角固定按钮 */}
      <header className="fixed top-6 right-6 z-50 flex items-center space-x-2">
        <Link
          href="/admin"
          className="p-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white group"
          title="后台管理"
        >
          <Settings className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
        </Link>

        <button
          className="p-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-white group"
          title="切换主题"
          onClick={() => {
            // TODO: 实现主题切换逻辑
            console.log("切换主题");
          }}
        >
          <Sun className="w-4 h-4 text-gray-600 group-hover:text-yellow-500 transition-colors" />
        </button>
      </header>

      {/* 主要内容 */}
      <main className="max-w-6xl mx-auto px-4 py-16">{children}</main>

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
