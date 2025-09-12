"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Home, User, FileText, Settings } from "lucide-react";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Home className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                SpringLament
              </h1>
              <p className="text-xs text-slate-500 -mt-1">个人博客</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center space-x-1"
            >
              <Home className="h-4 w-4" />
              <span>首页</span>
            </Link>
            <Link
              href="/admin"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center space-x-1"
            >
              <Settings className="h-4 w-4" />
              <span>管理</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* 底部 */}
      <footer className="bg-white/50 border-t border-slate-200/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-slate-500">
            <p>&copy; 2024 SpringLament Blog. 专注于高效创作和优雅展示.</p>
            <p className="mt-2">
              Built with Next.js 15 + TypeScript + Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
