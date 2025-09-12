import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 开始数据库种子...");

  // 创建默认管理员用户
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "0919",
    12
  );

  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@springlament.com",
      password: adminPassword,
      role: "ADMIN",
      profile: {
        create: {
          displayName: "管理员",
          bio: "SpringLament Blog 系统管理员",
          website: "https://springlament.com",
        },
      },
    },
  });

  console.log("✅ 创建管理员用户:", adminUser.username);

  // 创建默认分类
  const categories = [
    {
      name: "前端技术",
      slug: "frontend",
      description: "前端开发相关技术分享",
      color: "#3B82F6",
      icon: "💻",
      sortOrder: 1,
    },
    {
      name: "人工智能",
      slug: "ai",
      description: "AI 与机器学习相关内容",
      color: "#8B5CF6",
      icon: "🤖",
      sortOrder: 2,
    },
    {
      name: "算法数据结构",
      slug: "algorithm",
      description: "计算机基础知识与算法",
      color: "#10B981",
      icon: "🧮",
      sortOrder: 3,
    },
    {
      name: "生活随笔",
      slug: "happy-life",
      description: "个人感悟与生活分享",
      color: "#F59E0B",
      icon: "📝",
      sortOrder: 4,
    },
  ];

  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    });
    console.log("✅ 创建分类:", category.name);
  }

  // 创建一些示例标签
  const tags = [
    { name: "React", slug: "react", color: "#61DAFB" },
    { name: "Next.js", slug: "nextjs", color: "#000000" },
    { name: "TypeScript", slug: "typescript", color: "#3178C6" },
    { name: "JavaScript", slug: "javascript", color: "#F7DF1E" },
    { name: "Node.js", slug: "nodejs", color: "#339933" },
    { name: "Prisma", slug: "prisma", color: "#2D3748" },
    { name: "Tailwind CSS", slug: "tailwind", color: "#38BDF8" },
    { name: "Machine Learning", slug: "ml", color: "#FF6B6B" },
    { name: "Deep Learning", slug: "dl", color: "#4ECDC4" },
    { name: "Python", slug: "python", color: "#3776AB" },
    { name: "算法", slug: "algorithm", color: "#95A5A6" },
    { name: "数据结构", slug: "data-structure", color: "#E74C3C" },
    { name: "生活", slug: "life", color: "#F39C12" },
    { name: "思考", slug: "thinking", color: "#9B59B6" },
  ];

  for (const tagData of tags) {
    const tag = await prisma.tag.upsert({
      where: { slug: tagData.slug },
      update: {},
      create: tagData,
    });
    console.log("✅ 创建标签:", tag.name);
  }

  // 创建示例文章
  const frontendCategory = await prisma.category.findUnique({
    where: { slug: "frontend" },
  });
  const aiCategory = await prisma.category.findUnique({
    where: { slug: "ai" },
  });

  if (frontendCategory && aiCategory) {
    const post1 = await prisma.post.upsert({
      where: { slug: "building-modern-blog-with-nextjs" },
      update: {},
      create: {
        title: "使用 Next.js 构建现代博客系统",
        slug: "building-modern-blog-with-nextjs",
        content: `# 使用 Next.js 构建现代博客系统

在这篇文章中，我们将探讨如何使用 Next.js 15 构建一个现代化的博客系统。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **ORM**: Prisma
- **样式**: Tailwind CSS
- **认证**: NextAuth.js

## 项目结构

本项目采用了最新的 Next.js App Router 架构，具有以下特点：

1. **类型安全**: 全栈 TypeScript 支持
2. **高性能**: SSG + ISR 静态生成
3. **响应式**: 移动端优先的设计
4. **SEO 友好**: 内置 SEO 优化

## 总结

通过这个项目，我们成功构建了一个功能完整的博客系统，具备了现代 Web 应用的所有特性。`,
        excerpt: "探讨如何使用 Next.js 15 构建现代化博客系统的完整指南",
        published: true,
        featured: true,
        readingTime: 5,
        publishedAt: new Date(),
        authorId: adminUser.id,
        categoryId: frontendCategory.id,
      },
    });

    // 为文章添加标签
    const reactTag = await prisma.tag.findUnique({ where: { slug: "react" } });
    const nextjsTag = await prisma.tag.findUnique({
      where: { slug: "nextjs" },
    });
    const typescriptTag = await prisma.tag.findUnique({
      where: { slug: "typescript" },
    });

    if (reactTag && nextjsTag && typescriptTag) {
      const existingTags = await prisma.postTag.findMany({
        where: { postId: post1.id },
      });

      if (existingTags.length === 0) {
        await prisma.postTag.createMany({
          data: [
            { postId: post1.id, tagId: reactTag.id },
            { postId: post1.id, tagId: nextjsTag.id },
            { postId: post1.id, tagId: typescriptTag.id },
          ],
        });
      }
    }

    console.log("✅ 创建示例文章:", post1.title);

    // 创建第二篇文章
    const post2 = await prisma.post.upsert({
      where: { slug: "frontend-development-in-ai-era" },
      update: {},
      create: {
        title: "AI 时代的前端开发",
        slug: "frontend-development-in-ai-era",
        content: `# AI 时代的前端开发

人工智能正在改变前端开发的方方面面，从代码生成到用户体验优化。

## AI 工具在前端开发中的应用

### 1. 代码生成
- GitHub Copilot
- Cursor
- v0 by Vercel

### 2. 设计到代码
- Figma to Code
- Screenshot to Code

### 3. 性能优化
- 自动化的代码优化
- 智能的资源加载

## 未来展望

AI 将使前端开发变得更加高效和智能化。`,
        excerpt: "探讨人工智能如何改变前端开发的现状和未来",
        published: true,
        featured: false,
        readingTime: 3,
        publishedAt: new Date(),
        authorId: adminUser.id,
        categoryId: aiCategory.id,
      },
    });

    const aiTag = await prisma.tag.findUnique({ where: { slug: "ml" } });
    const jsTag = await prisma.tag.findUnique({
      where: { slug: "javascript" },
    });

    if (aiTag && jsTag) {
      const existingTags2 = await prisma.postTag.findMany({
        where: { postId: post2.id },
      });

      if (existingTags2.length === 0) {
        await prisma.postTag.createMany({
          data: [
            { postId: post2.id, tagId: aiTag.id },
            { postId: post2.id, tagId: jsTag.id },
          ],
        });
      }
    }

    console.log("✅ 创建示例文章:", post2.title);
  }

  console.log("🎉 数据库种子完成!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
