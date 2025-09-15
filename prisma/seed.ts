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

    // 创建第三篇文章 - 测试复杂 Markdown 渲染
    const post3 = await prisma.post.upsert({
      where: { slug: "markdown-rendering-test" },
      update: {},
      create: {
        title: "详细讲解Form组件的依赖关系",
        slug: "markdown-rendering-test",
        content: `# 详细讲解Form组件的依赖关系

## 🏗️ 整体架构概览

Schema-Components 的 Form 依赖系统基于以下核心组件构建：

\`\`\`mermaid
graph TD
    A[字段创建器 FieldCreator] --> B[依赖配置 dependency]
    B --> C[值依赖 value]
    B --> D[Props依赖 props]
    B --> E[字段依赖 fields]
    
    F[订阅系统 Subscription] --> G[useSubscribe Hook]
    G --> H[FormItemElWrapper]
    H --> I[依赖监听与处理]
    
    J[批量更新 BatchDepUpdate] --> K[性能优化]
    
    I --> L[动态字段渲染]
    I --> M[动态值计算]
    I --> N[动态属性更新]
\`\`\`

## 📋 一、值依赖 (Value Dependency) 实现机制

### 1.1 核心原理

值依赖通过监听指定字段的变化，自动计算并更新当前字段的值。

### 1.2 API 设计

\`\`\`typescript
// 字段创建器中的值依赖方法
DependencyValue<Key extends string>(
  deps: Key[], 
  depFn: DependencyValueFn<AnyObject, Key>
) {
  this._mergeVal({ dependency: { deps, value: depFn } })
  return this
}
\`\`\`

### 1.3 使用示例

\`\`\`typescript
F('值依赖字段', 'combinedValue')
  .DependencyValue(['gender', 'hobby'], (depValues, ctx) => {
    // depValues: { gender: 'male', hobby: 'basketball' }
    // ctx: { allValues, changedDepKeys, formRef, batchUpdate }
    return [depValues.gender, depValues.hobby].filter(Boolean).join('-')
  })
\`\`\`

### 1.4 特性与优势

- **自动计算**: 依赖字段变化时自动触发值计算
- **批量更新**: 支持一次性更新多个字段值
- **异步更新**: 避免循环依赖和性能问题
- **类型安全**: TypeScript 完整类型支持

## ⚡ 表格示例

| 特性 | 值依赖 | Props依赖 | 字段依赖 |
|------|--------|-----------|----------|
| **计算值** | ✅ | ❌ | ❌ |
| **动态属性** | ❌ | ✅ | ❌ |
| **字段切换** | ❌ | ❌ | ✅ |
| **性能** | 高 | 中 | 低 |

## 🎯 行内代码示例

在使用过程中，你可以通过 \`useSubscribe\` hook 来监听字段变化，也可以使用 \`BatchDepUpdate.update\` 来进行批量更新操作。

> **注意**: 字段依赖会完全替换原字段配置，因此与其他依赖类型互斥。

## 🔍 代码块示例

以下是一个完整的实现示例：

\`\`\`javascript
// 订阅系统核心实现
export class Subscription {
  constructor(initialValue) {
    this.value = initialValue;
    this.listeners = new Set();
  }

  setValue(newValue) {
    const prevValue = this.value;
    this.value = typeof newValue === 'function' 
      ? newValue(prevValue) 
      : newValue;
    
    // 通知所有监听器
    this.listeners.forEach(listener => {
      listener(this.value, prevValue);
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    
    // 返回取消订阅函数
    return () => {
      this.listeners.delete(listener);
    };
  }
}
\`\`\`

## 🐍 Python 示例

\`\`\`python
class DependencyManager:
    def __init__(self):
        self.dependencies = {}
        self.subscribers = {}
    
    def add_dependency(self, field, deps, callback):
        """添加字段依赖"""
        self.dependencies[field] = {
            'deps': deps,
            'callback': callback
        }
        
        for dep in deps:
            if dep not in self.subscribers:
                self.subscribers[dep] = []
            self.subscribers[dep].append(field)
    
    def update_field(self, field, value):
        """更新字段值并触发依赖"""
        # 更新字段值
        self.values[field] = value
        
        # 触发依赖该字段的其他字段
        if field in self.subscribers:
            for dependent_field in self.subscribers[field]:
                self._calculate_dependent_value(dependent_field)
\`\`\`

## 📊 JSON 配置示例

\`\`\`json
{
  "formConfig": {
    "fields": [
      {
        "key": "username",
        "type": "text",
        "label": "用户名",
        "required": true
      },
      {
        "key": "email", 
        "type": "email",
        "label": "邮箱",
        "dependency": {
          "deps": ["username"],
          "value": "(depValues) => \`\${depValues.username}@example.com\`"
        }
      }
    ]
  }
}
\`\`\`

## 🎨 CSS 样式

\`\`\`css
.form-field {
  margin-bottom: 1rem;
  padding: 0.5rem;
}

.form-field--dependent {
  background-color: #f8f9fa;
  border-left: 3px solid #007bff;
}

.form-field__label {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #333;
}

.form-field__input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
\`\`\`

## ✨ 总结

通过这套完整的依赖系统，我们可以轻松实现：

1. **响应式表单**: 字段间的智能联动
2. **动态验证**: 基于其他字段值的条件验证  
3. **智能填充**: 自动计算和填充字段值
4. **条件渲染**: 根据依赖动态显示/隐藏字段

这个设计充分体现了现代前端框架的响应式编程思想，为复杂表单场景提供了优雅的解决方案。`,
        excerpt:
          "深入解析 schema-components 组件库中 Form 的依赖实现机制，包含值依赖、Props依赖、字段依赖等核心概念",
        published: true,
        featured: true,
        readingTime: 10,
        publishedAt: new Date(),
        authorId: adminUser.id,
        categoryId: frontendCategory.id,
      },
    });

    // 为文章添加标签
    if (reactTag && typescriptTag && jsTag) {
      const existingTags3 = await prisma.postTag.findMany({
        where: { postId: post3.id },
      });

      if (existingTags3.length === 0) {
        await prisma.postTag.createMany({
          data: [
            { postId: post3.id, tagId: reactTag.id },
            { postId: post3.id, tagId: typescriptTag.id },
            { postId: post3.id, tagId: jsTag.id },
          ],
        });
      }
    }

    console.log("✅ 创建测试文章:", post3.title);
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
