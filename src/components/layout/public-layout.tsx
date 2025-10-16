"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 - 固定在顶部 */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
            >
              SpringLament
            </Link>

            {/* 右侧按钮 */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background hover:opacity-90 transition-all duration-300 text-sm font-medium transform hover:scale-105 active:scale-95"
              title="后台管理"
            >
              <LayoutDashboard className="w-4 h-4" strokeWidth={2} />
              <span>管理</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* 主要内容 - 添加顶部边距以避免被固定导航栏遮挡 */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20 animate-fade-in">
        {children}
      </main>

      {/* 极简底部 */}
      <footer className="border-t border-border/40 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-sm text-muted-foreground">
              © 2024 SpringLament Blog. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/60">
              春光摧折，夏花凋零，秋叶飘零，冬雪纷飞
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
