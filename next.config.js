/** @type {import('next').NextConfig} */

/**
 * Next.js 配置文件
 *
 * 这个文件用于自定义 Next.js 的构建和运行时行为
 * 支持的配置项包括：webpack 配置、路径重写、环境变量等
 *
 * 文档：https://nextjs.org/docs/app/api-reference/next-config-js
 */
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

  // 图片优化配置
  images: {
    unoptimized: false,
    // 允许的图片域名（用于外部图片优化）
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    // 图片格式优化
    formats: ["image/webp", "image/avif"],
    // 设备尺寸断点
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // 图片尺寸断点
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 图片质量
    minimumCacheTTL: 60,
  },

  // 编译输出配置
  // output: 'standalone', // 使用 standalone 模式用于 Docker 部署

  /**
   * 其他常用配置项（当前未启用）：
   *
   * // 自定义域名和路径（仅用于子路径部署）
   * basePath: '/blog',
   *
   * // 静态文件导出（不支持 API 路由和 SSR）
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
