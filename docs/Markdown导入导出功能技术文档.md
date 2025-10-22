# Markdown 导入导出功能技术文档

## 📋 目录

1. [功能概述](#功能概述)
2. [技术栈与核心库](#技术栈与核心库)
3. [导出功能实现](#导出功能实现)
4. [导入功能实现](#导入功能实现)
5. [数据流程](#数据流程)
6. [核心技术原理](#核心技术原理)
7. [架构设计](#架构设计)
8. [最佳实践](#最佳实践)

---

## 功能概述

### 导出功能

将博客文章从数据库导出为标准的 Markdown 文件格式，支持：

- 单篇文章导出为 `.md` 文件
- 批量文章导出为 `.zip` 压缩包
- 保留文章的所有元数据（分类、标签、发布状态等）
- 使用 YAML Front Matter 格式存储元数据

### 导入功能

从 Markdown 文件批量导入文章到数据库，支持：

- 解析 YAML Front Matter 元数据
- 自动创建不存在的分类和标签
- 自动生成缺失的字段（slug、摘要、阅读时间）
- 防止数据重复
- 详细的错误报告

---

## 技术栈与核心库

### 1. **gray-matter**

- **版本**: 建议 4.0+
- **作用**: 解析和生成 Markdown 的 YAML Front Matter
- **官网**: https://github.com/jonschlinkert/gray-matter

#### 什么是 Front Matter？

Front Matter 是 Markdown 文件顶部用 `---` 包裹的 YAML 格式元数据块：

```markdown
---
title: "我的文章标题"
slug: "my-article"
published: true
tags:
  - "JavaScript"
  - "React"
---

# 文章内容开始

这里是 Markdown 正文...
```

#### gray-matter 的使用

```typescript
import matter from "gray-matter";

// 解析 Markdown 文件
const fileContent = `---
title: Hello World
published: true
---

# Content here`;

const { data, content } = matter(fileContent);
// data: { title: 'Hello World', published: true }
// content: '# Content here'

// 生成 Markdown（我们使用手动拼接方式）
const yamlString = '---\ntitle: "Hello"\n---';
```

### 2. **archiver**

- **版本**: 建议 5.0+
- **作用**: 创建 ZIP 压缩包
- **官网**: https://github.com/archiverjs/node-archiver

#### 为什么选择 archiver？

- 支持流式压缩（节省内存）
- 可以动态添加文件内容
- 不需要先写入文件系统
- 支持事件驱动的异步处理

#### archiver 的使用

```typescript
import archiver from "archiver";

// 创建 ZIP 实例
const archive = archiver("zip", {
  zlib: { level: 6 }, // 压缩级别 0-9，6 为平衡选项
});

// 监听事件
archive.on("data", (chunk) => {
  // 处理数据块
});

archive.on("end", () => {
  // 压缩完成
});

archive.on("error", (err) => {
  // 处理错误
});

// 添加文件（从字符串）
archive.append("文件内容", { name: "filename.txt" });

// 添加文件（从流）
archive.append(fs.createReadStream("file.txt"), { name: "file.txt" });

// 完成压缩
await archive.finalize();
```

### 3. **ReadableStream (Web Streams API)**

- **作用**: 实现流式传输大文件
- **标准**: Web 标准 API

#### 为什么使用流式处理？

**传统方式的问题**：

```typescript
// ❌ 不推荐：一次性加载所有数据到内存
const allData = await generateAllData(); // 可能几百MB
return new Response(allData); // 内存占用过高
```

**流式处理的优势**：

```typescript
// ✅ 推荐：边生成边传输
const stream = new ReadableStream({
  start(controller) {
    // 逐块生成和推送数据
    controller.enqueue(chunk1);
    controller.enqueue(chunk2);
    controller.close();
  },
});
return new Response(stream);
```

**优势**：

- 内存占用低：不需要一次性加载所有数据
- 响应快：开始生成数据后立即开始传输
- 支持大文件：可以处理超过内存限制的文件

### 4. **Prisma ORM**

- **作用**: 数据库操作
- **特点**: 类型安全、自动补全

---

## 导出功能实现

### 架构图

```
┌─────────────┐
│   客户端    │
│  发起请求   │
└──────┬──────┘
       │
       │ POST /api/admin/posts/export
       │ { postIds: [...] }
       │
       ▼
┌─────────────────────────────────┐
│  验证权限 + 查询数据库           │
│  prisma.post.findMany()         │
└────────┬────────────────────────┘
         │
         │ posts[] 数据
         │
         ▼
┌─────────────────────────────────┐
│  创建 ReadableStream             │
│  + archiver 压缩实例             │
└────────┬────────────────────────┘
         │
         │ 流式处理
         │
         ▼
┌─────────────────────────────────┐
│  遍历文章：                      │
│  1. 构建 Front Matter            │
│  2. 转换为 YAML                  │
│  3. 生成 Markdown                │
│  4. 添加到 ZIP                   │
└────────┬────────────────────────┘
         │
         │ ZIP 数据块
         │
         ▼
┌─────────────────────────────────┐
│  通过流返回给客户端              │
│  Content-Type: application/zip  │
└─────────────────────────────────┘
```

### 核心实现步骤

#### 步骤 1: 查询数据库

```typescript
const posts = await prisma.post.findMany({
  where: { id: { in: postIds } },
  include: {
    author: { select: { username: true } },
    category: { select: { name: true } },
    tags: {
      select: {
        tag: { select: { name: true } },
      },
    },
  },
});
```

**关键点**：

- 使用 `include` 关联查询，一次获取所有需要的数据
- 使用 `select` 只选择需要的字段，减少数据传输量

#### 步骤 2: 构建 Front Matter

```typescript
function buildFrontMatter(post: PostWithRelations) {
  return {
    title: post.title,
    slug: post.slug,
    published: post.published,
    featured: post.featured,
    // 条件展开：只有值存在时才添加该字段
    ...(post.publishedAt && {
      publishedAt: post.publishedAt.toISOString(),
    }),
    ...(post.category && {
      category: post.category.name,
    }),
    // 提取标签名称数组
    ...(post.tags.length > 0 && {
      tags: post.tags.map((pt) => pt.tag.name),
    }),
    author: post.author.username,
  };
}
```

**设计思路**：

- 使用条件展开运算符 `...()` 只添加有值的字段
- 避免 `null` 或 `undefined` 出现在输出中
- 简化嵌套对象，只保留必要信息

#### 步骤 3: 转换为 YAML 格式

```typescript
function convertToYamlLines(frontMatter: Record<string, any>): string[] {
  const yamlLines: string[] = [];

  for (const [key, value] of Object.entries(frontMatter)) {
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      // 数组类型：YAML 列表语法
      yamlLines.push(`${key}:`);
      yamlLines.push(...value.map((item) => `  - "${item}"`));
    } else if (typeof value === "string" && value.includes("\n")) {
      // 多行字符串：YAML 字面量块
      yamlLines.push(`${key}: |`);
      yamlLines.push(...value.split("\n").map((line) => `  ${line}`));
    } else {
      // 普通值
      const formattedValue =
        typeof value === "string"
          ? `"${value.replace(/"/g, '\\"')}"` // 转义引号
          : value;
      yamlLines.push(`${key}: ${formattedValue}`);
    }
  }

  return yamlLines;
}
```

**YAML 语法处理**：

| 数据类型 | YAML 输出示例                                  |
| -------- | ---------------------------------------------- |
| 字符串   | `title: "Hello World"`                         |
| 数字     | `readingTime: 5`                               |
| 布尔值   | `published: true`                              |
| 数组     | `tags:`<br>`  - "JavaScript"`<br>`  - "React"` |
| 多行文本 | `excerpt: \|`<br>`  第一行`<br>`  第二行`      |

#### 步骤 4: 组合成完整 Markdown

```typescript
function convertPostToMarkdown(post: PostWithRelations): string {
  const frontMatter = buildFrontMatter(post);
  const yamlLines = convertToYamlLines(frontMatter);

  // 标准 Markdown Front Matter 格式
  return `---
${yamlLines.join("\n")}
---

${post.content || ""}`;
}
```

**输出格式**：

```markdown
---
title: "我的文章"
slug: "my-article"
published: true
tags:
  - "JavaScript"
  - "React"
---

# 文章内容

这里是正文...
```

#### 步骤 5: 创建流式响应

```typescript
const stream = new ReadableStream({
  start(controller) {
    // 创建压缩实例
    const archive = archiver("zip", {
      zlib: { level: 6 },
    });

    // 将压缩数据推送到流
    archive.on("data", (chunk: Buffer) => {
      controller.enqueue(new Uint8Array(chunk));
    });

    // 压缩完成，关闭流
    archive.on("end", () => {
      controller.close();
    });

    // 错误处理
    archive.on("error", (err: Error) => {
      controller.error(err);
    });

    // 异步添加文件并完成压缩
    processArchive(archive, posts, controller);
  },
});

return new Response(stream, {
  headers: {
    "Content-Type": "application/zip",
    "Content-Disposition": `attachment; filename="export.zip"`,
  },
});
```

**关键概念**：

1. **ReadableStream 的 start() 方法**
   - 在流创建时立即执行
   - 必须是同步函数
   - 通过 `controller` 控制流的状态

2. **controller 的三个方法**
   - `enqueue(chunk)`: 推送数据块到流
   - `close()`: 关闭流（完成传输）
   - `error(err)`: 报告错误

3. **事件驱动模式**
   - archiver 通过事件通知状态变化
   - `data` 事件：有新数据生成
   - `end` 事件：压缩完成
   - `error` 事件：出现错误

---

## 导入功能实现

### 架构图

```
┌─────────────┐
│   客户端    │
│  上传文件   │
└──────┬──────┘
       │
       │ POST /api/admin/posts/import
       │ FormData { files: [file1.md, file2.md] }
       │
       ▼
┌─────────────────────────────────┐
│  验证权限 + 提取文件             │
│  formData.getAll('files')       │
└────────┬────────────────────────┘
         │
         │ files[]
         │
         ▼
┌─────────────────────────────────┐
│  遍历文件，逐个处理：            │
│                                  │
│  1. 读取文件内容                 │
│  2. gray-matter 解析             │
│  3. 提取/生成字段                │
│  4. 检查 slug 重复               │
│  5. 查找/创建分类                │
│  6. 创建文章                     │
│  7. 查找/创建标签                │
│  8. 关联标签                     │
└────────┬────────────────────────┘
         │
         │ 统计结果
         │
         ▼
┌─────────────────────────────────┐
│  返回导入结果                    │
│  { success: 5, failed: 1 }      │
└─────────────────────────────────┘
```

### 核心实现步骤

#### 步骤 1: 解析 Markdown 文件

```typescript
async function parseMarkdownFile(file: File): Promise<ParsedPostData> {
  // 读取文件内容
  const content = await file.text();

  // 使用 gray-matter 解析
  const { data: frontMatter, content: markdownContent } = matter(content);

  // 提取或生成字段
  const title = frontMatter.title || file.name.replace(".md", "");
  const slug = frontMatter.slug || createSlug(title);
  const excerpt = frontMatter.excerpt || generateExcerpt(markdownContent);

  return {
    title,
    slug,
    content: markdownContent,
    excerpt,
    published: frontMatter.published ?? false,
    featured: frontMatter.featured ?? false,
    publishedAt: frontMatter.publishedAt
      ? new Date(frontMatter.publishedAt)
      : null,
    readingTime:
      frontMatter.readingTime || calculateReadingTime(markdownContent),
    categoryName: frontMatter.category || null,
    tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : [],
  };
}
```

**关键处理**：

- `??` 运算符：只在 `null` 或 `undefined` 时使用默认值
- `||` 运算符：在假值（包括空字符串）时使用默认值
- 类型验证：确保标签是数组
- 回退机制：front matter 缺失时自动生成

#### 步骤 2: 查找或创建分类（Find or Create 模式）

```typescript
async function findOrCreateCategory(
  categoryName: string | null
): Promise<string | null> {
  if (!categoryName) return null;

  // 先查找
  let category = await prisma.category.findFirst({
    where: { name: categoryName },
  });

  // 不存在则创建
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
```

**设计模式：Find or Create**

优势：

- ✅ 自动处理新分类
- ✅ 避免重复创建
- ✅ 简化导入逻辑
- ✅ 支持增量导入

缺点：

- ⚠️ 无法验证分类是否合法（可能导入拼写错误的分类）

解决方案：

- 在管理后台提供分类管理功能
- 导入后提供分类合并功能

#### 步骤 3: 创建文章记录

```typescript
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
```

**注意事项**：

- 所有必填字段都必须提供
- 外键（`authorId`, `categoryId`）必须存在于数据库中
- `slug` 必须唯一（在此之前已检查）

#### 步骤 4: 处理标签关联

```typescript
async function attachTagsToPost(
  postId: string,
  tagNames: string[]
): Promise<void> {
  for (const tagName of tagNames) {
    // 查找或创建标签
    const tag = await findOrCreateTag(tagName);

    // 创建关联记录（多对多关系）
    await prisma.postTag.create({
      data: {
        postId,
        tagId: tag.id,
      },
    });
  }
}
```

**多对多关系处理**：

数据库结构：

```
Post (文章表)
  ↓
PostTag (关联表)
  ↓
Tag (标签表)
```

Prisma Schema：

```prisma
model Post {
  id    String    @id @default(cuid())
  tags  PostTag[]
}

model Tag {
  id    String    @id @default(cuid())
  posts PostTag[]
}

model PostTag {
  post   Post   @relation(fields: [postId], references: [id])
  postId String
  tag    Tag    @relation(fields: [tagId], references: [id])
  tagId  String

  @@id([postId, tagId]) // 复合主键
}
```

---

## 数据流程

### 导出流程详解

```
┌──────────────────┐
│ 1. 数据库查询     │
│ SELECT * FROM... │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│ 2. 数据转换                   │
│ Database Object → Front Matter│
│ {                            │
│   id: "123",                 │
│   title: "Hello",            │
│   category: {                │
│     name: "Tech"             │
│   }                          │
│ }                            │
│         ↓                    │
│ {                            │
│   title: "Hello",            │
│   category: "Tech"           │
│ }                            │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 3. YAML 序列化                │
│ Object → YAML String         │
│ {                            │
│   title: "Hello",            │
│   tags: ["JS", "React"]      │
│ }                            │
│         ↓                    │
│ title: "Hello"               │
│ tags:                        │
│   - "JS"                     │
│   - "React"                  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 4. Markdown 组装              │
│ ---                          │
│ title: "Hello"               │
│ ---                          │
│                              │
│ # Content                    │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 5. ZIP 压缩（流式）           │
│ article1.md → 压缩            │
│ article2.md → 压缩            │
│ README.md   → 压缩            │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 6. 流式响应                   │
│ HTTP Response (chunked)      │
└──────────────────────────────┘
```

### 导入流程详解

```
┌──────────────────┐
│ 1. 文件上传       │
│ FormData         │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│ 2. 读取文件                   │
│ File → String                │
│ ---                          │
│ title: "Hello"               │
│ ---                          │
│ # Content                    │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 3. gray-matter 解析           │
│ String → { data, content }   │
│ data: {                      │
│   title: "Hello",            │
│   tags: ["JS"]               │
│ }                            │
│ content: "# Content"         │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 4. 字段提取/生成              │
│ - title: 从 data 或文件名     │
│ - slug: 从 data 或生成        │
│ - excerpt: 从 data 或生成     │
│ - readingTime: 从 data 或计算 │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 5. 重复检查                   │
│ SELECT WHERE slug = ?        │
│ 存在？→ 跳过                  │
└────────┬─────────────────────┘
         │ 不存在
         ▼
┌──────────────────────────────┐
│ 6. 分类处理                   │
│ findFirst(category)          │
│ 存在？→ 使用                  │
│ 不存在？→ 创建                │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 7. 创建文章                   │
│ INSERT INTO posts            │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 8. 标签处理                   │
│ 遍历每个标签：                │
│ - findFirst(tag)             │
│ - 不存在则 create            │
│ - 创建 PostTag 关联           │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 9. 返回结果                   │
│ {                            │
│   success: 5,                │
│   failed: 1,                 │
│   errors: [...]              │
│ }                            │
└──────────────────────────────┘
```

---

## 核心技术原理

### 1. 流式处理（Streaming）

#### 为什么需要流式处理？

**场景**: 导出 1000 篇文章，总大小 100MB

**方案 A: 传统方式（不推荐）**

```typescript
// 一次性生成所有内容
const allContent = [];
for (const post of posts) {
  allContent.push(convertPostToMarkdown(post));
}
const zipBuffer = await createZip(allContent); // 100MB 占用内存
return new Response(zipBuffer);
```

问题：

- 内存占用高（100MB）
- 用户等待时间长（生成完才开始传输）
- 无法处理超大文件

**方案 B: 流式处理（推荐）**

```typescript
const stream = new ReadableStream({
  start(controller) {
    const archive = archiver("zip");

    // 边生成边传输
    archive.on("data", (chunk) => {
      controller.enqueue(chunk); // 立即推送给客户端
    });

    // 逐个处理文章
    for (const post of posts) {
      const markdown = convertPostToMarkdown(post);
      archive.append(markdown, { name: `${post.slug}.md` });
    }

    archive.finalize();
  },
});
return new Response(stream);
```

优势：

- ✅ 内存占用低（只保留当前处理的文章）
- ✅ 响应快（边生成边传输）
- ✅ 支持超大文件

#### ReadableStream 的工作原理

```typescript
const stream = new ReadableStream({
  start(controller) {
    // 流开始时调用一次
    // controller 用于控制流的状态
  },

  pull(controller) {
    // 消费者请求更多数据时调用（可选）
  },

  cancel() {
    // 消费者取消流时调用（可选）
  },
});
```

**状态机**:

```
[未启动] --start()--> [可读取] --enqueue()--> [有数据]
                          ↑                      |
                          └──────consume()───────┘

[可读取] --close()--> [已关闭]
[可读取] --error()--> [出错]
```

### 2. 事件驱动架构

#### archiver 的事件系统

```typescript
const archive = archiver("zip");

// 事件监听
archive.on("data", handleData); // 有数据生成
archive.on("end", handleEnd); // 压缩完成
archive.on("error", handleError); // 发生错误
archive.on("warning", handleWarn); // 警告信息
archive.on("progress", handleProgress); // 进度更新
```

**事件流程**:

```
append() → 'data' → 'data' → 'data' → finalize() → 'end'
                                ↓
                            如果出错
                                ↓
                            'error'
```

#### 为什么使用事件而不是 Promise？

**Promise 方式（不适用）**:

```typescript
const zipBuffer = await archive.finalize(); // 必须等待全部完成
return new Response(zipBuffer); // 一次性返回
```

**事件方式（更灵活）**:

```typescript
archive.on("data", (chunk) => {
  // 每生成一块数据就立即推送
  controller.enqueue(chunk);
});

archive.on("end", () => {
  // 完成时关闭流
  controller.close();
});
```

优势：

- ✅ 支持流式处理
- ✅ 内存效率高
- ✅ 可以实时响应

### 3. YAML Front Matter

#### 为什么选择 YAML？

**对比其他格式**:

| 格式 | 优点               | 缺点                 | 可读性     |
| ---- | ------------------ | -------------------- | ---------- |
| JSON | 标准化、易解析     | 不支持注释、语法严格 | ⭐⭐⭐     |
| TOML | 类型丰富           | 不够流行             | ⭐⭐⭐⭐   |
| YAML | 人类友好、支持注释 | 解析复杂、缩进敏感   | ⭐⭐⭐⭐⭐ |

**YAML 示例**:

```yaml
# 这是注释
title: "我的文章"
published: true
tags:
  - JavaScript
  - React
excerpt: |
  这是多行文本
  第二行
  第三行
metadata:
  views: 1000
  likes: 50
```

**等价 JSON**:

```json
{
  "title": "我的文章",
  "published": true,
  "tags": ["JavaScript", "React"],
  "excerpt": "这是多行文本\n第二行\n第三行",
  "metadata": {
    "views": 1000,
    "likes": 50
  }
}
```

#### YAML 语法重点

1. **缩进表示层级**（必须用空格，不能用 Tab）

```yaml
parent:
  child: value
```

2. **列表语法**

```yaml
# 方式 1
tags:
  - JavaScript
  - React

# 方式 2
tags: [JavaScript, React]
```

3. **多行字符串**

```yaml
# 保留换行符
content: |
  第一行
  第二行

# 折叠换行符
content: >
  这是一段很长的文本
  会被折叠成一行
```

4. **引号规则**

```yaml
# 不需要引号
title: Hello World

# 特殊字符需要引号
title: "Hello: World"
title: 'Hello: World'

# 转义
title: "He said \"Hello\""
```

### 4. 查找或创建模式（Find or Create）

#### 模式实现

```typescript
async function findOrCreate<T>(
  findFn: () => Promise<T | null>,
  createFn: () => Promise<T>
): Promise<T> {
  let entity = await findFn();
  if (!entity) {
    entity = await createFn();
  }
  return entity;
}

// 使用
const category = await findOrCreate(
  () => prisma.category.findFirst({ where: { name: "Tech" } }),
  () => prisma.category.create({ data: { name: "Tech", slug: "tech" } })
);
```

#### 潜在问题：竞态条件

**场景**: 两个请求同时导入相同分类

```
时间 →

请求 A: findFirst('Tech') → null
请求 B: findFirst('Tech') → null
请求 A: create('Tech') → ✅
请求 B: create('Tech') → ❌ 重复错误！
```

**解决方案 1: 数据库唯一约束**

```prisma
model Category {
  id   String @id
  name String @unique // 添加唯一约束
  slug String @unique
}
```

**解决方案 2: 使用事务 + upsert**

```typescript
const category = await prisma.category.upsert({
  where: { name: categoryName },
  update: {}, // 已存在则不更新
  create: {
    name: categoryName,
    slug: createSlug(categoryName),
  },
});
```

---

## 架构设计

### 代码组织结构

```
src/app/api/admin/posts/
├── export/
│   └── route.ts          # 导出端点
│       ├── 类型定义
│       ├── 辅助函数
│       │   ├── buildFrontMatter()
│       │   ├── convertToYamlLines()
│       │   ├── convertPostToMarkdown()
│       │   ├── sanitizeFileName()
│       │   ├── generateIndexContent()
│       │   └── processArchive()
│       └── HTTP 处理器
│           ├── POST (批量导出)
│           └── GET (单篇导出)
│
└── import/
    └── route.ts          # 导入端点
        ├── 类型定义
        ├── 辅助函数
        │   ├── parseMarkdownFile()
        │   ├── findOrCreateCategory()
        │   ├── findOrCreateTag()
        │   ├── attachTagsToPost()
        │   └── processFileImport()
        └── HTTP 处理器
            └── POST (批量导入)
```

### 设计原则

#### 1. 单一职责原则（SRP）

每个函数只做一件事：

```typescript
// ✅ 好：职责单一
function parseMarkdownFile(file: File): Promise<ParsedPostData>;
function findOrCreateCategory(name: string): Promise<string | null>;
function attachTagsToPost(postId: string, tags: string[]): Promise<void>;

// ❌ 不好：职责混杂
function importPost(file: File): Promise<void> {
  // 解析文件
  // 创建分类
  // 创建文章
  // 处理标签
  // ...太多职责
}
```

#### 2. 依赖注入

将依赖作为参数传入：

```typescript
// ✅ 好：依赖明确
async function processArchive(
  archive: archiver.Archiver,
  posts: PostWithRelations[],
  controller: ReadableStreamDefaultController
): Promise<void>;

// ❌ 不好：隐藏依赖
async function processArchive(): Promise<void> {
  const posts = await fetchPosts(); // 隐式依赖
  const archive = createArchive(); // 隐式依赖
}
```

#### 3. 错误处理分层

```typescript
// 文件级错误：记录到结果
async function processFileImport(
  file: File,
  userId: string,
  results: ImportResults
) {
  try {
    // 处理逻辑
  } catch (error) {
    results.failed++;
    results.errors.push(`${file.name}: ${error.message}`);
  }
}

// 请求级错误：返回 HTTP 错误
export async function POST(request: NextRequest) {
  try {
    // 处理逻辑
  } catch (error) {
    console.error("导入错误:", error);
    return NextResponse.json({ error: "导入失败" }, { status: 500 });
  }
}
```

### 性能优化策略

#### 1. 数据库查询优化

```typescript
// ❌ N+1 查询问题
const posts = await prisma.post.findMany();
for (const post of posts) {
  const author = await prisma.user.findUnique({ where: { id: post.authorId } });
  const category = await prisma.category.findUnique({
    where: { id: post.categoryId },
  });
}
// 总查询数：1 + N*2

// ✅ 使用关联查询
const posts = await prisma.post.findMany({
  include: {
    author: true,
    category: true,
    tags: { include: { tag: true } },
  },
});
// 总查询数：1
```

#### 2. 批量操作

```typescript
// ❌ 逐个创建
for (const tagName of tags) {
  await prisma.postTag.create({
    data: { postId, tagId: getTagId(tagName) },
  });
}

// ✅ 批量创建（如果 API 支持）
await prisma.postTag.createMany({
  data: tags.map((tagName) => ({
    postId,
    tagId: getTagId(tagName),
  })),
});
```

#### 3. 流式处理

```typescript
// ❌ 一次性加载
const allContent = posts.map((post) => convertPostToMarkdown(post));
const zip = await createZip(allContent); // 占用大量内存

// ✅ 流式处理
const stream = new ReadableStream({
  start(controller) {
    for (const post of posts) {
      const markdown = convertPostToMarkdown(post);
      archive.append(markdown, { name: `${post.slug}.md` });
      // 每次只处理一篇文章
    }
  },
});
```

---

## 最佳实践

### 1. 错误处理

#### 提供详细的错误信息

```typescript
// ❌ 不好
results.errors.push("导入失败");

// ✅ 好
results.errors.push(`${file.name}: 文章标识 "${slug}" 已存在`);
```

#### 区分不同类型的错误

```typescript
if (!session || session.user.role !== "ADMIN") {
  return NextResponse.json({ error: "无权限访问" }, { status: 403 });
}

if (!files || files.length === 0) {
  return NextResponse.json({ error: "未选择文件" }, { status: 400 });
}

if (!user) {
  return NextResponse.json(
    { error: "用户不存在，请重新登录" },
    { status: 401 }
  );
}
```

### 2. 类型安全

#### 定义明确的类型

```typescript
// ✅ 好：类型清晰
interface ParsedPostData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  // ...
}

// ❌ 不好：类型模糊
function parseMarkdownFile(file: File): Promise<any>;
```

#### 避免类型断言

```typescript
// ❌ 不好：强制断言
const files = formData.getAll("files") as File[];

// ✅ 好：运行时验证
const files = formData.getAll("files");
if (!files.every((f) => f instanceof File)) {
  throw new Error("Invalid file type");
}
```

### 3. 安全性

#### 文件名消毒

```typescript
function sanitizeFileName(slug: string): string {
  // 只保留安全字符
  return slug.replace(/[^a-zA-Z0-9-_]/g, "_");
}
```

#### 防止路径遍历攻击

```typescript
// ❌ 危险
archive.append(content, { name: frontMatter.filename });
// 如果 filename = "../../etc/passwd"，可能导致安全问题

// ✅ 安全
const safeFilename = sanitizeFileName(post.slug);
archive.append(content, { name: `${safeFilename}.md` });
```

#### 限制文件大小

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

if (file.size > MAX_FILE_SIZE) {
  results.failed++;
  results.errors.push(`${file.name}: 文件过大（最大 10MB）`);
  continue;
}
```

### 4. 可维护性

#### 使用常量

```typescript
const MAX_POSTS_PER_EXPORT = 500;
const MAX_BATCH_EXPORT = 1000;
const ZIP_COMPRESSION_LEVEL = 6;

if (postIds.length > MAX_POSTS_PER_EXPORT) {
  return NextResponse.json(
    { error: `一次最多只能导出${MAX_POSTS_PER_EXPORT}篇文章` },
    { status: 400 }
  );
}
```

#### 添加日志

```typescript
console.info(`开始导出 ${posts.length} 篇文章`);
console.error("压缩包创建错误:", err);
console.warn(`分类 "${categoryName}" 不存在，自动创建`);
```

#### 版本化 API

```typescript
// 在 Front Matter 中添加版本信息
const frontMatter = {
  // ...其他字段
  _version: "1.0",
  _exportedBy: "SpringLament Blog",
  _exportedAt: new Date().toISOString(),
};
```

### 5. 用户体验

#### 提供进度反馈

```typescript
// 可以扩展为支持进度回调
interface ExportProgress {
  current: number;
  total: number;
  currentFile: string;
}

// 使用 Server-Sent Events 实时推送进度
```

#### 生成索引文件

```typescript
// 在 ZIP 中包含 README.md
const indexContent = `# 博客导出索引

导出时间: ${new Date().toISOString()}
文章数量: ${posts.length}

## 文章列表

${posts
  .map((post, index) => `${index + 1}. [${post.title}](${post.slug}.md)`)
  .join("\n")}
`;

archive.append(indexContent, { name: "README.md" });
```

#### 防止重复导入

```typescript
const existingPost = await prisma.post.findUnique({
  where: { slug: postData.slug },
});

if (existingPost) {
  results.failed++;
  results.errors.push(`${file.name}: 文章标识 "${slug}" 已存在`);
  return; // 跳过此文件
}
```

---

## 常见问题

### Q1: 为什么不直接使用 JSON 格式？

A: Markdown + YAML Front Matter 的优势：

- 人类可读性强
- 支持版本控制（Git）
- 可以直接在编辑器中编辑
- 与静态网站生成器（Hugo、Jekyll）兼容

### Q2: 如何处理超大文件？

A:

1. 使用流式处理（已实现）
2. 限制单次导出数量（已实现：1000 篇）
3. 可以考虑分片导出：

```typescript
// 导出 0-999
POST /api/admin/posts/export?offset=0&limit=1000

// 导出 1000-1999
POST /api/admin/posts/export?offset=1000&limit=1000
```

### Q3: 如何处理并发导入？

A: 使用数据库事务和唯一约束：

```typescript
await prisma.$transaction(async (tx) => {
  const post = await tx.post.create({...});
  await tx.postTag.createMany({...});
});
```

### Q4: 导入的文章作者怎么处理？

A: 当前策略：

- 使用当前登录用户作为作者
- 忽略 Front Matter 中的 author 字段

可选策略：

- 根据 author 字段查找或创建用户
- 保留原作者信息到自定义字段

### Q5: 如何测试导入导出功能？

A:

```typescript
// 单元测试
describe("parseMarkdownFile", () => {
  it("应该正确解析 Front Matter", async () => {
    const file = new File(
      [
        `---
title: Test
---
Content`,
      ],
      "test.md"
    );

    const result = await parseMarkdownFile(file);
    expect(result.title).toBe("Test");
    expect(result.content).toBe("Content");
  });
});

// 集成测试
describe("POST /api/admin/posts/import", () => {
  it("应该成功导入 Markdown 文件", async () => {
    const formData = new FormData();
    formData.append("files", file);

    const response = await fetch("/api/admin/posts/import", {
      method: "POST",
      body: formData,
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.results.success).toBe(1);
  });
});
```

---

## 扩展阅读

### 相关技术文档

- [gray-matter 文档](https://github.com/jonschlinkert/gray-matter)
- [archiver 文档](https://www.archiverjs.com/)
- [Streams API 文档](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
- [YAML 规范](https://yaml.org/spec/)
- [Prisma 文档](https://www.prisma.io/docs)

### 相关标准

- [Markdown 规范（CommonMark）](https://commonmark.org/)
- [YAML 1.2 规范](https://yaml.org/spec/1.2.2/)
- [HTTP Chunked Transfer Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding)

---

## 总结

本文档详细介绍了博客系统的 Markdown 导入导出功能：

**核心技术**：

- gray-matter: 解析和生成 YAML Front Matter
- archiver: 创建 ZIP 压缩包
- ReadableStream: 实现流式传输
- Prisma: 数据库操作

**关键概念**：

- 流式处理：降低内存占用，提升性能
- 事件驱动：实现异步数据处理
- Find or Create 模式：自动处理关联数据
- 单一职责：提高代码可维护性

**最佳实践**：

- 详细的错误处理和日志
- 类型安全和运行时验证
- 安全的文件名处理
- 用户友好的反馈机制

希望这份文档能帮助你理解整个导入导出系统的实现原理！
