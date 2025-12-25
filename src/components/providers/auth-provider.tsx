"use client";

/**
 * NextAuth.js 会话提供器组件
 *
 * 这个组件包装应用程序，提供认证会话上下文
 * 使所有子组件都能访问用户会话信息
 *
 * 文档：https://next-auth.js.org/getting-started/client#sessionprovider
 */

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 认证提供器组件
 *
 * 包装应用程序的根组件，提供认证上下文
 * 使用 NextAuth.js 的 SessionProvider
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider
      // 优化：减少会话刷新频率，从每次焦点变化改为5分钟
      refetchInterval={5 * 60} // 5分钟自动刷新一次
      // 优化：禁用窗口焦点时自动刷新，避免不必要的网络请求
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
