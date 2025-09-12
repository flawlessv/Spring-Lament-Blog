/**
 * NextAuth.js API 路由处理器
 *
 * 这个文件是 NextAuth.js 的 API 路由处理器
 * 使用 App Router 的新格式，处理所有认证相关的 API 请求
 *
 * 路由模式：/api/auth/[...nextauth]
 *
 * 支持的端点：
 * - GET  /api/auth/session - 获取当前会话
 * - POST /api/auth/signin - 用户登录
 * - POST /api/auth/signout - 用户登出
 * - GET  /api/auth/providers - 获取认证提供商
 * - GET  /api/auth/csrf - 获取 CSRF token
 *
 * 文档：https://next-auth.js.org/getting-started/rest-api
 */

import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// 创建 NextAuth 处理器
const handler = NextAuth(authOptions);

// 导出 GET 和 POST 方法处理器
// App Router 要求明确导出每个 HTTP 方法
export {
  handler as GET, // 处理 GET 请求（获取会话、提供商等）
  handler as POST, // 处理 POST 请求（登录、登出等）
};
