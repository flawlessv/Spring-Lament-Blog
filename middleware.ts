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
 * 这些路由需要用户登录且具有管理员权限才能访问
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

    // 检查是否为受保护的路由
    const isProtectedRoute = protectedRoutes.some((route) => {
      if (route.includes(":path*")) {
        // 处理动态路由匹配
        const baseRoute = route.replace("/:path*", "");
        return pathname.startsWith(baseRoute);
      }
      return pathname === route || pathname.startsWith(route + "/");
    });

    // 如果是受保护路由但用户未登录或不是管理员
    if (isProtectedRoute) {
      if (!token) {
        // 未登录，重定向到登录页
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (token.role !== "ADMIN") {
        // 不是管理员，重定向到首页
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // 如果用户已登录且访问登录页，重定向到管理员页面
    if (pathname === "/login" && token?.role === "ADMIN") {
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
       * 返回 true 表示允许中间件运行
       * 返回 false 表示跳过中间件
       */
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // 对于公开路由，总是允许访问
        const isPublicRoute = publicRoutes.some((route) => {
          if (route.includes(":path*")) {
            const baseRoute = route.replace("/:path*", "");
            return pathname.startsWith(baseRoute);
          }
          return pathname === route || pathname.startsWith(route + "/");
        });

        if (isPublicRoute) {
          return true;
        }

        // 对于受保护路由，检查用户是否为管理员
        return token?.role === "ADMIN";
      },
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
    /**
     * 匹配所有路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (网站图标)
     * - public 文件夹下的静态资源
     * - API 路由（除了 /api/auth）
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
