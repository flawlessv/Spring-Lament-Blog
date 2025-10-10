/**
 * Next.js 中间件 - 路由保护
 *
 * 这个中间件在每个请求到达页面之前运行
 * 用于保护管理员路由，确保只有已认证的管理员用户可以访问
 *
 * 文档：https://nextjs.org/docs/app/building-your-application/routing/middleware
 * NextAuth中间件：https://next-auth.js.org/configuration/nextjs#middleware
 */

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * 受保护的路由配置
 *
 * 这些路由需要用户登录才能访问
 */
const protectedRoutes = [
  "/admin", // 管理员主页
  "/admin/:path*", // 所有管理员子路由
];

/**
 * 公开路由配置
 *
 * 这些路由不需要认证即可访问
 */
const publicRoutes = [
  "/", // 首页
  "/login", // 登录页
  "/api/auth/:path*", // NextAuth API 路由
  "/posts/:path*", // 文章页面（前台）
  "/categories/:path*", // 分类页面（前台）
  "/tags/:path*", // 标签页面（前台）
];

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // 如果用户已登录且访问登录页，重定向到管理员页面
    if (pathname === "/login" && token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // 继续处理请求
    return NextResponse.next();
  },
  {
    /**
     * 中间件回调配置
     *
     * 用于决定何时运行中间件
     */
    callbacks: {
      /**
       * 授权回调
       *
       * 返回 true 表示允许访问
       * 返回 false 表示重定向到登录页
       */
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // 如果访问管理员路由，必须已登录
        if (pathname.startsWith("/admin")) {
          return !!token;
        }

        // 其他路由都允许访问
        return true;
      },
    },
    pages: {
      signIn: "/login", // 确保重定向到正确的登录页面
    },
  }
);

/**
 * 中间件匹配器配置
 *
 * 定义哪些路由会运行中间件
 * 排除静态资源和 API 路由（除了认证相关的）
 */
export const config = {
  matcher: [
    // 仅保护 admin 路由，避免影响 API 与公开页面
    "/admin/:path*",
    "/login",
  ],
};
