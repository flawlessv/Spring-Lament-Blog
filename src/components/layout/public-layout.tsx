"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Moon, Sun } from "lucide-react";

interface PublicLayoutProps {
  children: ReactNode;
  extraButtons?: ReactNode; // 额外的按钮，用于文章详情页的沉浸式阅读
}

export default function PublicLayout({
  children,
  extraButtons,
}: PublicLayoutProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (theme === "light") {
      html.classList.add("dark");
      setTheme("dark");
    } else {
      html.classList.remove("dark");
      setTheme("light");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部右上角按钮 */}
      <div className="fixed top-0 right-0 z-50 pt-4 pr-6 lg:pr-8 flex items-center gap-2">
        {/* 额外的按钮（如沉浸式阅读） */}
        {extraButtons}

        {/* 主题切换按钮 */}
        <button
          onClick={toggleTheme}
          className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-accent transition-colors"
          title={theme === "light" ? "深色模式" : "浅色模式"}
        >
          {mounted &&
            (theme === "light" ? (
              <Moon className="w-4 h-4 text-foreground" strokeWidth={2} />
            ) : (
              <Sun className="w-4 h-4 text-foreground" strokeWidth={2} />
            ))}
        </button>

        {/* 管理按钮 */}
        <Link
          href="/admin"
          className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-accent transition-colors"
          title="后台管理"
        >
          <LayoutDashboard
            className="w-4 h-4 text-foreground"
            strokeWidth={2}
          />
        </Link>
      </div>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-20 animate-fade-in">
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
