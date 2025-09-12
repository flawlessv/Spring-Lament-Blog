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
      // 会话检查间隔时间（秒）
      // 设置为 0 表示不自动刷新会话
      refetchInterval={0}
      // 当窗口获得焦点时是否重新获取会话
      // 在用户切换标签页后回来时确保会话状态最新
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}
