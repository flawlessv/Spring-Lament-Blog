/** @type {import('next').NextConfig} */

/**
 * Next.js 配置文件
 *
 * 这个文件用于自定义 Next.js 的构建和运行时行为
 * 支持的配置项包括：webpack 配置、路径重写、环境变量等
 *
 * 文档：https://nextjs.org/docs/app/api-reference/next-config-js
 */
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  // 实验性功能配置
  experimental: {
    /**
     * 类型化路由 (Typed Routes)
     *
     * 启用后，Next.js 会自动生成路由的 TypeScript 类型
     * 提供编译时的路由检查和自动完成
     *
     * 优势：
     * - 防止路由拼写错误
     * - 提供更好的 IDE 支持
     * - 重构时自动更新路由引用
     */
    typedRoutes: true,
  },
  basePath: "",
  output: "export",
  /**
   * 其他常用配置项（当前未启用）：
   *
   * // 自定义域名和路径
   * basePath: '/my-app',
   *
   * // 静态文件导出
   * output: 'export',
   *
   * // 图片优化配置
   * images: {
   *   domains: ['example.com'],
   *   unoptimized: false
   * },
   *
   * // 重定向配置
   * redirects: async () => [...],
   *
   * // 环境变量
   * env: {
   *   customKey: 'value'
   * }
   */
};

// 使用 CommonJS 格式导出，确保与 Node.js 兼容
module.exports = nextConfig;
