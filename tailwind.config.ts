import type { Config } from "tailwindcss";

/**
 * Tailwind CSS 配置文件
 *
 * 这个文件定义了 Tailwind CSS 的行为和主题系统
 * 包括内容扫描路径、主题定制、插件配置等
 *
 * 文档：https://tailwindcss.com/docs/configuration
 */
const config: Config = {
  /**
   * 内容扫描路径配置
   *
   * Tailwind 会扫描这些文件中的类名使用情况
   * 只有被使用的样式类才会被包含在最终的 CSS 文件中
   * 这个过程叫做 "purging"，可以大大减少生产环境的 CSS 体积
   */
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // Pages Router 页面（如果使用）
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // 所有组件文件
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // App Router 页面和组件
  ],

  /**
   * 主题配置
   *
   * 可以自定义颜色、字体、间距等设计系统元素
   * extend 选项用于扩展默认主题而不是替换
   */
  theme: {
    extend: {
      /**
       * 自定义颜色系统
       *
       * 使用 CSS 变量定义颜色，支持主题切换
       * 在 globals.css 中定义对应的 CSS 变量
       */
      colors: {
        // 背景色 - 支持亮/暗主题切换
        background: "var(--background)",
        // 前景色（文字颜色） - 支持亮/暗主题切换
        foreground: "var(--foreground)",
      },

      /**
       * 其他可扩展的主题选项（示例）：
       *
       * // 自定义字体
       * fontFamily: {
       *   sans: ['Inter', 'sans-serif'],
       *   mono: ['Fira Code', 'monospace'],
       * },
       *
       * // 自定义断点
       * screens: {
       *   'xs': '475px',
       * },
       *
       * // 自定义间距
       * spacing: {
       *   '18': '4.5rem',
       * },
       *
       * // 自定义动画
       * animation: {
       *   'spin-slow': 'spin 3s linear infinite',
       * }
       */
    },
  },

  /**
   * 插件配置
   *
   * Tailwind 插件可以添加新的功能类、组件类或者工具类
   * 常用插件包括：
   * - @tailwindcss/forms - 表单样式重置
   * - @tailwindcss/typography - 文字排版
   * - @tailwindcss/aspect-ratio - 宽高比工具
   */
  plugins: [
    // 当前没有使用任何插件
    // 后续可能会添加：
    // require('@tailwindcss/typography'),    // 用于博客文章排版
    // require('@tailwindcss/forms'),         // 用于表单样式
  ],
};

export default config;
