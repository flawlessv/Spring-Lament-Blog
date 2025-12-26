import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import archiver from "archiver";

/**
 * 类型定义
 * PostWithRelations: 包含关联数据的文章类型
 */
type PostWithRelations = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  published: boolean;
  featured: boolean;
  excerpt: string | null;
  coverImage: string | null;
  readingTime: number | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  author: { username: string };
  category: { name: string } | null;
  tags: { tag: { name: string } }[];
};

/**
 * 构建文章的前置元数据对象
 *
 * 原理：将文章数据转换为 Markdown front matter 所需的键值对象
 * - 必填字段：title, slug, published 等
 * - 可选字段：仅在有值时才包含（使用条件展开运算符）
 *
 * @param post - 包含关联数据的文章对象
 * @returns 前置元数据对象
 */
function buildFrontMatter(post: PostWithRelations) {
  return {
    title: post.title,
    slug: post.slug,
    published: post.published,
    featured: post.featured,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    // 以下字段只有在存在时才添加到对象中
    ...(post.publishedAt && { publishedAt: post.publishedAt.toISOString() }),
    ...(post.excerpt && { excerpt: post.excerpt }),
    ...(post.coverImage && { coverImage: post.coverImage }),
    ...(post.readingTime && { readingTime: post.readingTime }),
    ...(post.category && { category: post.category.name }),
    // 提取标签名称数组
    ...(post.tags.length > 0 && {
      tags: post.tags.map((postTag) => postTag.tag.name),
    }),
    author: post.author.username,
  };
}

/**
 * 将前置元数据对象转换为 YAML 格式字符串
 *
 * 原理：遍历对象的每个键值对，根据值的类型生成对应的 YAML 语法
 * - 数组类型：使用 YAML 列表语法（- item）
 * - 多行字符串：使用 YAML 字面量块语法（|）
 * - 普通字符串：使用引号包裹并转义内部引号
 * - 其他类型：直接输出值
 *
 * @param frontMatter - 前置元数据对象
 * @returns YAML 格式的字符串数组（每行一个元素）
 */
function convertToYamlLines(frontMatter: Record<string, any>): string[] {
  const yamlLines: string[] = [];

  // 遍历对象的所有键值对
  for (const [key, value] of Object.entries(frontMatter)) {
    // 跳过空值
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      // 处理数组：生成 YAML 列表格式
      // 例如：tags:
      //        - "tag1"
      //        - "tag2"
      yamlLines.push(`${key}:`);
      const arrayItems = value.map((item) => `  - "${item}"`);
      yamlLines.push(...arrayItems);
    } else if (typeof value === "string" && value.includes("\n")) {
      // 处理多行字符串：使用 YAML 字面量块
      // 例如：excerpt: |
      //        第一行
      //        第二行
      yamlLines.push(`${key}: |`);
      const indentedLines = value.split("\n").map((line) => `  ${line}`);
      yamlLines.push(...indentedLines);
    } else {
      // 处理普通值
      // 字符串类型：添加引号并转义内部引号
      // 其他类型：直接输出
      const formattedValue =
        typeof value === "string" ? `"${value.replace(/"/g, '\\"')}"` : value;
      yamlLines.push(`${key}: ${formattedValue}`);
    }
  }

  return yamlLines;
}

/**
 * 将文章转换为 Markdown 格式（包含 YAML front matter）
 *
 * 原理：将文章数据转换为标准的 Markdown 格式
 * 结构：--- (分隔符)
 *       YAML 元数据
 *       --- (分隔符)
 *
 *       Markdown 内容
 *
 * @param post - 文章对象
 * @returns Markdown 格式的字符串
 */
function convertPostToMarkdown(post: PostWithRelations): string {
  // 1. 构建前置元数据对象
  const frontMatter = buildFrontMatter(post);

  // 2. 转换为 YAML 格式
  const yamlLines = convertToYamlLines(frontMatter);

  // 3. 组合成完整的 Markdown 文档
  return `---\n${yamlLines.join("\n")}\n---\n\n${post.content || ""}`;
}

/**
 * 生成安全的文件名
 *
 * 原理：移除或替换文件名中的特殊字符，避免文件系统错误
 * 只保留字母、数字、连字符和下划线
 *
 * @param slug - 文章的 slug
 * @returns 安全的文件名（不含扩展名）
 */
function sanitizeFileName(slug: string): string {
  return slug.replace(/[^a-zA-Z0-9-_]/g, "_");
}

/**
 * 生成导出索引文件的内容
 *
 * 原理：创建一个 README.md 文件，列出所有导出的文章
 * 包含导出时间、文章数量和文章列表
 *
 * @param posts - 文章数组
 * @returns 索引文件的 Markdown 内容
 */
function generateIndexContent(posts: PostWithRelations[]): string {
  const exportTime = new Date().toISOString();
  const postCount = posts.length;

  // 生成文章列表项
  const postListItems = posts.map((post, index) => {
    const safeFileName = sanitizeFileName(post.slug);
    const status = post.published ? "(已发布)" : "(草稿)";
    return `${index + 1}. [${post.title}](${safeFileName}.md) ${status}`;
  });

  return `# 博客导出索引

导出时间: ${exportTime}
文章数量: ${postCount}

## 文章列表

${postListItems.join("\n")}

---
由 Spring Broken AI Blog 博客系统导出
`;
}

/**
 * 处理压缩包的异步操作
 *
 * 原理：将所有文章转换为 Markdown 文件并添加到 ZIP 压缩包中
 * 步骤：
 * 1. 遍历所有文章
 * 2. 转换为 Markdown 格式
 * 3. 添加到压缩包
 * 4. 生成并添加索引文件
 * 5. 完成压缩
 *
 * @param archive - archiver 实例
 * @param posts - 要导出的文章数组
 * @param controller - ReadableStream 的控制器，用于错误处理
 */
async function processArchive(
  archive: archiver.Archiver,
  posts: PostWithRelations[],
  controller: ReadableStreamDefaultController<Uint8Array>
): Promise<void> {
  try {
    // 步骤1：遍历所有文章并添加到压缩包
    for (const post of posts) {
      // 转换文章为 Markdown 格式
      const markdownContent = convertPostToMarkdown(post);

      // 生成安全的文件名
      const safeFileName = sanitizeFileName(post.slug);

      // 将 Markdown 文件添加到压缩包
      archive.append(markdownContent, { name: `${safeFileName}.md` });
    }

    // 步骤2：生成并添加索引文件
    const indexContent = generateIndexContent(posts);
    archive.append(indexContent, { name: "README.md" });

    // 步骤3：完成压缩包创建
    // finalize() 会触发 'end' 事件，关闭流
    await archive.finalize();
  } catch (error) {
    // 如果处理过程中出错，通知流控制器
    console.error("处理文章时出错:", error);
    controller.error(error);
  }
}

/**
 * POST /api/admin/posts/export
 * 批量导出文章为 ZIP 压缩包
 *
 * 工作原理：
 * 1. 验证管理员权限
 * 2. 从数据库查询要导出的文章（支持全部导出或按 ID 导出）
 * 3. 创建 ReadableStream 用于流式传输 ZIP 数据
 * 4. 使用 archiver 库创建 ZIP 压缩包
 * 5. 将每篇文章转换为 Markdown 文件并添加到压缩包
 * 6. 通过流式响应返回给客户端
 *
 * 为什么使用流式处理：
 * - 避免一次性将所有数据加载到内存
 * - 支持大量文章的导出
 * - 边生成边传输，提升用户体验
 */
export async function POST(request: NextRequest) {
  try {
    // ============ 1. 权限验证 ============
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限访问" }, { status: 403 });
    }

    // ============ 2. 解析请求参数 ============
    const { postIds, exportAll = false } = await request.json();

    // ============ 3. 查询文章数据 ============
    // 定义需要关联查询的字段（避免查询不必要的数据）
    const baseInclude = {
      author: {
        select: { username: true },
      },
      category: {
        select: { name: true },
      },
      tags: {
        select: {
          tag: {
            select: { name: true },
          },
        },
      },
    };

    let posts: PostWithRelations[];

    if (exportAll) {
      // 导出所有文章（限制最多1000篇，防止内存溢出）
      posts = await prisma.post.findMany({
        include: baseInclude,
        orderBy: {
          createdAt: "desc",
        },
        take: 1000,
      });
    } else if (postIds && postIds.length > 0) {
      // 按指定 ID 导出文章
      if (postIds.length > 500) {
        return NextResponse.json(
          { error: "一次最多只能导出500篇文章" },
          { status: 400 }
        );
      }

      posts = await prisma.post.findMany({
        where: {
          id: { in: postIds },
        },
        include: baseInclude,
      });
    } else {
      return NextResponse.json(
        { error: "未选择要导出的文章" },
        { status: 400 }
      );
    }

    // 验证查询结果
    if (posts.length === 0) {
      return NextResponse.json(
        { error: "没有找到要导出的文章" },
        { status: 404 }
      );
    }

    // ============ 4. 创建流式响应 ============
    /**
     * ReadableStream 工作原理：
     * - start() 方法在流创建时立即执行
     * - controller 控制流的数据推送和状态
     * - 通过 enqueue() 推送数据块
     * - 通过 close() 关闭流
     * - 通过 error() 报告错误
     */
    const stream = new ReadableStream({
      start(controller) {
        // 创建 ZIP 压缩包实例
        // level: 6 表示中等压缩级别（平衡速度和压缩率）
        const archive = archiver("zip", {
          zlib: { level: 6 },
        });

        // 监听压缩包错误事件
        archive.on("error", handleArchiveError);

        // 监听压缩包数据事件，将数据推送到流
        archive.on("data", handleArchiveData);

        // 监听压缩包完成事件，关闭流
        archive.on("end", handleArchiveEnd);

        // 错误处理函数
        function handleArchiveError(err: Error) {
          console.error("压缩包创建错误:", err);
          controller.error(err);
        }

        // 数据处理函数：将压缩包的数据块推送到响应流
        function handleArchiveData(chunk: Buffer) {
          controller.enqueue(new Uint8Array(chunk));
        }

        // 完成处理函数：关闭响应流
        function handleArchiveEnd() {
          controller.close();
        }

        // 启动异步处理流程
        // 注意：这里不能直接使用 async/await，因为 start() 必须是同步的
        // 所以我们将异步逻辑封装到独立函数中
        processArchive(archive, posts, controller);
      },
    });

    // ============ 5. 返回流式响应 ============
    const fileName = `blog-export-${new Date().toISOString().slice(0, 10)}.zip`;

    return new Response(stream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("导出错误:", error);
    return NextResponse.json(
      { error: "导出失败，请稍后重试" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/posts/export?id={postId}
 * 导出单个文章为 Markdown 文件
 *
 * 工作原理：
 * 1. 验证管理员权限
 * 2. 从 URL 查询参数获取文章 ID
 * 3. 查询指定的文章及其关联数据
 * 4. 转换为带 YAML front matter 的 Markdown 格式
 * 5. 直接返回 Markdown 文本内容
 *
 * 与 POST 方法的区别：
 * - POST：批量导出多篇文章，返回 ZIP 压缩包，使用流式处理
 * - GET：导出单篇文章，直接返回 Markdown 文本，无需压缩
 */
export async function GET(request: NextRequest) {
  try {
    // ============ 1. 权限验证 ============
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限访问" }, { status: 403 });
    }

    // ============ 2. 解析请求参数 ============
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json({ error: "文章 ID 不能为空" }, { status: 400 });
    }

    // ============ 3. 查询文章数据 ============
    // 使用 findUnique 因为是按主键查询（性能更好）
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: { username: true },
        },
        category: {
          select: { name: true },
        },
        tags: {
          select: {
            tag: {
              select: { name: true },
            },
          },
        },
      },
    });

    // 验证文章是否存在
    if (!post) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    // ============ 4. 转换为 Markdown 格式 ============
    // 复用上面定义的辅助函数
    const markdownContent = convertPostToMarkdown(post);

    // ============ 5. 返回 Markdown 文件 ============
    // 生成安全的文件名
    const fileName = `${sanitizeFileName(post.slug)}.md`;

    return new NextResponse(markdownContent, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("单文章导出错误:", error);
    return NextResponse.json(
      { error: "导出失败，请稍后重试" },
      { status: 500 }
    );
  }
}
