/**
 * 生成 slug（将中文转为拼音风格，英文转为小写连字符）
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // 空格和下划线转为连字符
    .replace(/[^\w\u4e00-\u9fa5-]/g, "") // 只保留字母、数字、中文和连字符
    .replace(/--+/g, "-") // 多个连字符合并
    .replace(/^-|-$/g, ""); // 去掉首尾连字符
}
