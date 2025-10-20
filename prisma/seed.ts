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
      email: "zhaoshiwei1@xiaomi.com",
      password: adminPassword,
      role: "ADMIN",
      profile: {
        create: {
          displayName: "春光摧折",
          bio: "虚无主义|INFJ",
          avatar: "https://youke1.picui.cn/s1/2025/10/20/68f62247112d7.png",
          website: "http://powder.icu/",
          github: "https://github.com/flawlessv",
          bilibili: "INFJ_LIB_0919",
          phone: "19838558988",
          location: "武汉",
          company: "小米科技",
          position: "前端开发工程师",
        },
      },
    },
  });

  console.log("✅ 创建管理员用户:", adminUser.username);

  // 创建默认分类
  const categories = [
    {
      name: "AI",
      slug: "ai",
      description: "人工智能、大模型、机器学习相关内容",
      color: "#8B5CF6",
      icon: "🧑🏻‍🎤",
      sortOrder: 2,
    },
    {
      name: "前端",
      slug: "frontend",
      description: "前端开发技术、框架、工具分享",
      color: "#3B82F6",
      icon: "🪷",
      sortOrder: 1,
    },
    {
      name: "源码解析",
      slug: "source-code",
      description: "开源项目源码分析与解读",
      color: "#10B981",
      icon: "🔍",
      sortOrder: 3,
    },
    {
      name: "编程基础",
      slug: "programming",
      description: "编程基础知识、算法、数据结构",
      color: "#F59E0B",
      icon: "🧮",
      sortOrder: 4,
    },
    {
      name: "软技能",
      slug: "soft-skills",
      description: "沟通技巧、思维方法、职场经验",
      color: "#EF4444",
      icon: "🍋‍🟩",
      sortOrder: 5,
    },
    {
      name: "AboutMe",
      slug: "about-me",
      description: "个人经历、成长感悟、自我介绍",
      color: "#6366F1",
      icon: "👋",
      sortOrder: 7,
    },
    {
      name: "随笔",
      slug: "essays",
      description: "生活感悟、思考随笔、日常记录",
      color: "#14B8A6",
      icon: "📝",
      sortOrder: 6,
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
    { name: "HTML", slug: "html", color: "#E34F26" },
    { name: "CSS", slug: "css", color: "#1572B6" },
    { name: "JavaScript", slug: "js", color: "#F7DF1E" },
    { name: "TypeScript", slug: "ts", color: "#3178C6" },
    { name: "Node.js", slug: "node", color: "#339933" },
    { name: "React", slug: "react", color: "#61DAFB" },
    { name: "Prompt", slug: "prompt", color: "#FF6B6B" },
    { name: "MCP", slug: "mcp", color: "#4ECDC4" },
    { name: "RAG", slug: "rag", color: "#9B59B6" },
    { name: "Agent", slug: "agent", color: "#E74C3C" },
    { name: "Git", slug: "git", color: "#F05032" },
    // 保留一些常用的技术标签
    { name: "Next.js", slug: "nextjs", color: "#000000" },
    { name: "Prisma", slug: "prisma", color: "#2D3748" },
    { name: "Tailwind CSS", slug: "tailwind", color: "#38BDF8" },
    { name: "算法", slug: "algorithm", color: "#95A5A6" },
    { name: "数据结构", slug: "data-structure", color: "#E74C3C" },
    { name: "生活", slug: "life", color: "#F39C12" },
  ];

  for (const tagData of tags) {
    const tag = await prisma.tag.upsert({
      where: { slug: tagData.slug },
      update: {},
      create: tagData,
    });
    console.log("✅ 创建标签:", tag.name);
  }

  // 不创建初始文章，保持数据库干净

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
