/** @type {import('postcss-load-config').Config} */

/**
 * PostCSS 配置文件
 *
 * PostCSS 是一个用 JavaScript 编写的 CSS 后处理工具
 * 它可以通过插件系统转换和优化 CSS
 *
 * 在这个项目中，PostCSS 主要用于：
 * 1. 处理 Tailwind CSS 的指令
 * 2. 添加浏览器厂商前缀
 *
 * 文档：https://postcss.org/
 */
const config = {
  /**
   * PostCSS 插件配置
   *
   * 插件按照配置顺序执行，顺序很重要
   */
  plugins: {
    /**
     * Tailwind CSS 插件
     *
     * 处理 Tailwind 的 @tailwind 指令：
     * - @tailwind base     - 重置样式和基础样式
     * - @tailwind components - 组件样式类
     * - @tailwind utilities - 工具样式类
     *
     * 这个插件会根据 tailwind.config.ts 的配置
     * 以及实际使用的类名来生成最终的 CSS
     */
    tailwindcss: {},

    /**
     * Autoprefixer 插件
     *
     * 自动为 CSS 属性添加浏览器厂商前缀
     * 基于 Can I Use 数据库和 browserslist 配置
     *
     * 例如：
     * display: flex;
     * →
     * display: -webkit-box;
     * display: -ms-flexbox;
     * display: flex;
     *
     * 配置文件：package.json 中的 browserslist 字段
     * 或者项目根目录的 .browserslistrc 文件
     */
    autoprefixer: {},

    /**
     * 其他常用的 PostCSS 插件（当前未使用）：
     *
     * // CSS 压缩
     * cssnano: process.env.NODE_ENV === 'production' ? {} : false,
     *
     * // CSS 嵌套支持
     * 'postcss-nested': {},
     *
     * // CSS 变量处理
     * 'postcss-custom-properties': {},
     *
     * // CSS 导入处理
     * 'postcss-import': {},
     */
  },
};

// 使用 CommonJS 格式导出，确保与 Node.js 构建工具兼容
module.exports = config;
