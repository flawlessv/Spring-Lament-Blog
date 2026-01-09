"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-8 w-16 rounded-full bg-gray-100 dark:bg-gray-800",
          className
        )}
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none",
        "bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800",
        className
      )}
      title={theme === "light" ? "切换到深色模式" : "切换到亮色模式"}
    >
      {/* 滑动背景圆圈 */}
      <span
        className={cn(
          "absolute left-1 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-gray-200 shadow-sm transition-transform duration-300 ease-in-out z-20",
          theme === "dark" ? "translate-x-8" : "translate-x-0"
        )}
      >
        {theme === "light" ? (
          <Sun className="w-3.5 h-3.5 text-black" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-black" />
        )}
      </span>

      {/* 静态图标 - 太阳 */}
      <span className="flex-1 flex justify-center z-10">
        <Sun
          className={cn(
            "w-3.5 h-3.5 transition-opacity duration-300",
            theme === "light" ? "opacity-0" : "opacity-40 text-gray-500"
          )}
        />
      </span>

      {/* 静态图标 - 月亮 */}
      <span className="flex-1 flex justify-center z-10">
        <Moon
          className={cn(
            "w-3.5 h-3.5 transition-opacity duration-300",
            theme === "dark" ? "opacity-0" : "opacity-40 text-gray-500"
          )}
        />
      </span>
    </button>
  );
}
