/**
 * 漂亮的全局 Loading 组件
 * 使用渐变动画和脉冲效果
 */

import React from "react";

export function BeautifulLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
      {/* 动画容器 */}
      <div className="relative">
        {/* 外圈旋转 */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 rounded-full" />
        </div>

        {/* 中圈反向旋转 */}
        <div className="absolute inset-2 animate-spin">
          <div className="w-12 h-12 border-4 border-t-pink-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full" />
        </div>

        {/* 内圈脉冲 */}
        <div className="absolute inset-4 animate-pulse">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
        </div>
      </div>

      {/* 加载文字 */}
      <p className="mt-8 text-sm text-muted-foreground animate-pulse">
        加载中...
      </p>
    </div>
  );
}

/**
 * 小型 Loading - 用于按钮或内联
 */
export function MiniLoading() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-4 h-4">
        <div className="absolute inset-0 animate-spin">
          <div className="w-full h-full border-2 border-t-primary border-r-transparent border-b-primary/50 border-l-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * 页面级 Loading - 用于页面切换
 */
export function PageLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      {/* 渐变背景动画 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[100px] opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-full animate-ping blur-3xl" />
        </div>
      </div>

      {/* Loading 内容 */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          {/* 光晕效果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
        </div>

        {/* 进度条 */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-progress" />
        </div>

        {/* 文字 */}
        <p className="text-sm text-muted-foreground animate-pulse">
          正在加载...
        </p>
      </div>
    </div>
  );
}

export default BeautifulLoading;
