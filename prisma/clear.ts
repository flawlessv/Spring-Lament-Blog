import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑️  开始清空数据库...");

  try {
    // 按照依赖关系的反序删除数据，避免外键约束问题
    const count1 = await prisma.postTag.deleteMany({});
    console.log(`✅ 已清空 PostTag 表 (${count1.count} 条)`);

    const count2 = await prisma.post.deleteMany({});
    console.log(`✅ 已清空 Post 表 (${count2.count} 条)`);

    const count3 = await prisma.category.deleteMany({});
    console.log(`✅ 已清空 Category 表 (${count3.count} 条)`);

    const count4 = await prisma.tag.deleteMany({});
    console.log(`✅ 已清空 Tag 表 (${count4.count} 条)`);

    const count5 = await prisma.profile.deleteMany({});
    console.log(`✅ 已清空 Profile 表 (${count5.count} 条)`);

    const count6 = await prisma.user.deleteMany({});
    console.log(`✅ 已清空 User 表 (${count6.count} 条)`);

    console.log("🎉 数据库清空完成！");
  } catch (error: any) {
    console.error("❌ 清空数据库失败:");
    console.error(error.message);
    process.exit(1);
  }
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
