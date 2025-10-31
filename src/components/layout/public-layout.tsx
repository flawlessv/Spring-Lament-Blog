"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Moon, Sun, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublicLayoutProps {
  children: ReactNode;
  extraButtons?: ReactNode; // 额外的按钮，用于文章详情页的沉浸式阅读
  leftButtons?: ReactNode; // 左侧按钮，用于返回等操作
  sidebar?: ReactNode; // 侧边栏内容（个人信息和分类）
}

export default function PublicLayout({
  children,
  extraButtons,
  leftButtons,
  sidebar,
}: PublicLayoutProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {/* 汉堡菜单按钮 - 仅移动端显示，与右侧按钮水平对齐，与文章左对齐 */}
      {sidebar && (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 pt-4 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 pointer-events-auto">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-4 h-4 text-foreground" strokeWidth={2} />
              ) : (
                <Menu className="w-4 h-4 text-foreground" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      )}

      {/* 遮罩层 - 移动端显示 */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 - 移动端滑出 */}
      {sidebar && (
        <aside
          className={cn(
            "fixed left-0 top-0 h-full w-80 bg-background border-r border-border transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:hidden"
          )}
        >
          <div className="p-6">{sidebar}</div>
        </aside>
      )}

      {/* 顶部左侧按钮 - 与内容区域对齐 */}
      {leftButtons && (
        <div className="fixed top-0 left-0 z-50 pt-6 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 pointer-events-auto">
            {leftButtons}
          </div>
        </div>
      )}

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
            <p className="text-xs text-muted-foreground/60 text-center">
              &ldquo;哪里的海都一样 东京也可以变成獾子岛&rdquo;
              <br />
              &ldquo;The sea is the same everywhere，even Tokyo can become
              Badger Island.&rdquo;
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
