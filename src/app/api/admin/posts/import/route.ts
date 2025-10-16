import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import matter from "gray-matter";
import { createSlug, calculateReadingTime, generateExcerpt } from "@/lib/utils";

/**
 * 类型定义
 */
// 导入结果统计
interface ImportResults {
  success: number;
  failed: number;
  errors: string[];
  imported: ImportedPostInfo[];
}

// 导入的文章信息
interface ImportedPostInfo {
  id: string;
  title: string;
  slug: string;
}

// 解析后的文章数据
interface ParsedPostData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  featured: boolean;
  publishedAt: Date | null;
  readingTime: number;
  coverImage: string | null;
  categoryName: string | null;
  tags: string[];
}

/**
 * 从 Markdown 文件解析文章数据
 *
 * 原理：
 * 1. 读取文件内容
 * 2. 使用 gray-matter 库解析 YAML front matter
 * 3. 提取或生成文章所需的各个字段
 *
 * @param file - 上传的 Markdown 文件
 * @returns 解析后的文章数据
 */
async function parseMarkdownFile(file: File): Promise<ParsedPostData> {
  // 读取文件内容
  const content = await file.text();

  // 解析 YAML front matter 和 Markdown 内容
  // gray-matter 会将 --- 包裹的 YAML 部分解析为 data 对象
  const { data: frontMatter, content: markdownContent } = matter(content);

  // 提取或生成标题（优先使用 front matter 中的 title）
  const title = frontMatter.title || file.name.replace(".md", "");

  // 提取或生成 slug（URL 友好的标识符）
  const slug = frontMatter.slug || createSlug(title);

  // 提取或生成摘要
  const excerpt = frontMatter.excerpt || generateExcerpt(markdownContent);

  // 提取布尔值字段（使用 ?? 运算符设置默认值）
  const published = frontMatter.published ?? false;
  const featured = frontMatter.featured ?? false;

  // 处理发布时间（如果提供则转换为 Date 对象）
  const publishedAt = frontMatter.publishedAt
    ? new Date(frontMatter.publishedAt)
    : null;

  // 提取或计算阅读时间
  const readingTime =
    frontMatter.readingTime || calculateReadingTime(markdownContent);

  // 提取分类和标签
  const categoryName = frontMatter.category || null;
  const tags = Array.isArray(frontMatter.tags) ? frontMatter.tags : [];

  return {
    title,
    slug,
    content: markdownContent,
    excerpt,
    published,
    featured,
    publishedAt,
    readingTime,
    coverImage: frontMatter.coverImage || null,
    categoryName,
    tags,
  };
}

/**
 * 查找或创建分类
 *
 * 原理：采用 "查找或创建" (Find or Create) 模式
 * 1. 先尝试从数据库查找同名分类
 * 2. 如果不存在，则自动创建新分类
 * 3. 返回分类 ID
 *
 * 这样可以避免重复创建分类，同时支持自动导入新分类
 *
 * @param categoryName - 分类名称
 * @returns 分类 ID，如果没有分类则返回 null
 */
async function findOrCreateCategory(
  categoryName: string | null
): Promise<string | null> {
  if (!categoryName) {
    return null;
  }

  // 查找现有分类（使用 findFirst 因为按 name 字段查询）
  let category = await prisma.category.findFirst({
    where: { name: categoryName },
  });

  // 如果分类不存在，则创建新分类
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: categoryName,
        slug: createSlug(categoryName),
      },
    });
  }

  return category.id;
}

/**
 * 查找或创建标签
 *
 * 原理：与分类类似，采用 "查找或创建" 模式
 *
 * @param tagName - 标签名称
 * @returns 标签对象
 */
async function findOrCreateTag(tagName: string) {
  // 查找现有标签
  let tag = await prisma.tag.findFirst({
    where: { name: tagName },
  });

  // 如果标签不存在，则创建新标签
  if (!tag) {
    tag = await prisma.tag.create({
      data: {
        name: tagName,
        slug: createSlug(tagName),
      },
    });
  }

  return tag;
}

/**
 * 关联文章和标签
 *
 * 原理：
 * 1. 遍历所有标签名称
 * 2. 查找或创建标签
 * 3. 在 PostTag 关联表中创建记录
 *
 * @param postId - 文章 ID
 * @param tagNames - 标签名称数组
 */
async function attachTagsToPost(
  postId: string,
  tagNames: string[]
): Promise<void> {
  for (const tagName of tagNames) {
    // 查找或创建标签
    const tag = await findOrCreateTag(tagName);

    // 创建文章-标签关联记录
    await prisma.postTag.create({
      data: {
        postId,
        tagId: tag.id,
      },
    });
  }
}

/**
 * 处理单个文件的导入
 *
 * 原理：
 * 1. 验证文件格式（必须是 .md 文件）
 * 2. 解析 Markdown 文件内容
 * 3. 检查 slug 是否重复
 * 4. 处理分类（查找或创建）
 * 5. 创建文章记录
 * 6. 处理标签（查找或创建并关联）
 *
 * @param file - 上传的文件
 * @param userId - 用户 ID（作为文章作者）
 * @param results - 导入结果统计对象（会被修改）
 */
async function processFileImport(
  file: File,
  userId: string,
  results: ImportResults
): Promise<void> {
  // ========== 1. 验证文件格式 ==========
  if (!file.name.endsWith(".md")) {
    results.failed++;
    results.errors.push(`${file.name}: 不是 Markdown 文件`);
    return;
  }

  try {
    // ========== 2. 解析文件内容 ==========
    const postData = await parseMarkdownFile(file);

    // ========== 3. 检查 slug 是否已存在 ==========
    const existingPost = await prisma.post.findUnique({
      where: { slug: postData.slug },
    });

    if (existingPost) {
      results.failed++;
      results.errors.push(`${file.name}: 文章标识 "${postData.slug}" 已存在`);
      return;
    }

    // ========== 4. 处理分类 ==========
    const categoryId = await findOrCreateCategory(postData.categoryName);

    // ========== 5. 创建文章记录 ==========
    const post = await prisma.post.create({
      data: {
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        excerpt: postData.excerpt,
        published: postData.published,
        featured: postData.featured,
        publishedAt: postData.publishedAt,
        readingTime: postData.readingTime,
        coverImage: postData.coverImage,
        authorId: userId,
        categoryId,
      },
    });

    // ========== 6. 处理标签 ==========
    if (postData.tags.length > 0) {
      await attachTagsToPost(post.id, postData.tags);
    }

    // ========== 7. 记录成功结果 ==========
    results.success++;
    results.imported.push({
      id: post.id,
      title: post.title,
      slug: post.slug,
    });
  } catch (error) {
    // 记录失败结果
    results.failed++;
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    results.errors.push(`${file.name}: ${errorMessage}`);
  }
}

/**
 * POST /api/admin/posts/import
 * 批量导入 Markdown 文件为文章
 *
 * 工作原理：
 * 1. 验证管理员权限
 * 2. 从 FormData 中提取上传的文件
 * 3. 遍历每个文件并处理导入
 * 4. 返回导入结果统计
 *
 * 特性：
 * - 支持批量导入多个 Markdown 文件
 * - 自动解析 YAML front matter
 * - 自动创建不存在的分类和标签
 * - 自动生成缺失的字段（slug、excerpt、readingTime）
 * - 防止 slug 重复
 * - 详细的错误报告
 */
export async function POST(request: NextRequest) {
  try {
    // ============ 1. 权限验证 ============
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限访问" }, { status: 403 });
    }

    // ============ 2. 提取上传的文件 ============
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    // 验证是否有文件
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "未选择文件" }, { status: 400 });
    }

    // ============ 3. 验证用户存在 ============
    // 在开始处理前验证用户，避免处理多个文件后才发现用户不存在
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "用户不存在，请重新登录" },
        { status: 401 }
      );
    }

    // ============ 4. 初始化结果统计对象 ============
    const results: ImportResults = {
      success: 0,
      failed: 0,
      errors: [],
      imported: [],
    };

    // ============ 5. 处理每个文件 ============
    for (const file of files) {
      await processFileImport(file, user.id, results);
    }

    // ============ 6. 返回导入结果 ============
    return NextResponse.json({
      message: `导入完成: 成功 ${results.success} 个，失败 ${results.failed} 个`,
      results,
    });
  } catch (error) {
    console.error("Markdown 导入错误:", error);
    return NextResponse.json(
      { error: "导入失败，请稍后重试" },
      { status: 500 }
    );
  }
}
