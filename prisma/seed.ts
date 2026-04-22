import { PrismaClient } from "@prisma/client";

process.env.DATABASE_URL = "file:./prisma/dev.db";
const prisma = new PrismaClient();

async function main() {
  // 创建管理员账号
  const admin = await prisma.user.upsert({
    where: { phone: "13800000000" },
    update: {},
    create: {
      phone: "13800000000",
      password: "$2a$10$abcdefghijklmnopqrstuv", // 占位，实际需要真实密码
      nickname: "犟爸",
      role: "ADMIN",
    },
  });

  // 创建第一本书
  const book = await prisma.book.upsert({
    where: { id: "book-1" },
    update: {},
    create: {
      id: "book-1",
      title: "在远远的背后带领",
      subtitle: "PET父母效能训练的中国实践",
      author: "安心",
      description:
        "这是一本关于“如何成为一个不控制、不评判、却能深度影响孩子”的书。",
      readingGuide:
        "【为什么读这本书？】\n\n安心老师将 PET 的核心理念与中国家庭的实际情况相结合，用真实案例告诉我们：当我们放下“好父母”的拒子，转而成为“真实的自己”，孩子自然会被吸引。\n\n【阅读建议】\n· 每天读 1 章，不要赶进\n· 做笔记：哪一句话触动了你？\n· 实践：每天试着用一个 PET 技巧与孩子对话",
      isActive: true,
      isPublished: true,
      order: 1,
    },
  });

  // 创建章节
  const chapters = [
    { title: "导读：为什么推荐这本书", order: 1 },
    { title: "Ch1 不越界：什么是父母的边界", order: 2 },
    { title: "Ch2 不评判：放下对错，看见孩子", order: 3 },
    { title: "Ch3 负责任：养育的目标是什么", order: 4 },
    { title: "Ch4 无伤害：语言的力量与暴力", order: 5 },
    { title: "Ch5 共情：走进孩子的内心世界", order: 6 },
    { title: "Ch6 我信息：表达真实的自己", order: 7 },
  ];

  for (const ch of chapters) {
    const chapter = await prisma.chapter.upsert({
      where: { id: `chapter-${ch.order}` },
      update: {},
      create: {
        id: `chapter-${ch.order}`,
        bookId: book.id,
        title: ch.title,
        order: ch.order,
      },
    });

    // 为每章创建音频
    await prisma.audioFile.upsert({
      where: { id: `audio-${ch.order}` },
      update: {},
      create: {
        id: `audio-${ch.order}`,
        chapterId: chapter.id,
        title: ch.title,
        url: `/audio/chapter-${ch.order}.mp3`,
        duration: 600 + Math.floor(Math.random() * 300),
        type: ch.order <= 2 ? "HUMAN" : "AI_CLONE",
        order: 1,
      },
    });
  }

  // 创建学习资料
  const materials = [
    { title: "PET 核心概念思维导图", type: "pdf", url: "/docs/pet-mindmap.pdf" },
    { title: "本书金句卡片", type: "image", url: "/docs/quotes.zip" },
    { title: "读书笔记模板", type: "pdf", url: "/docs/note-template.pdf" },
  ];

  for (let i = 0; i < materials.length; i++) {
    await prisma.material.upsert({
      where: { id: `material-${i + 1}` },
      update: {},
      create: {
        id: `material-${i + 1}`,
        bookId: book.id,
        title: materials[i].title,
        url: materials[i].url,
        type: materials[i].type,
        order: i + 1,
      },
    });
  }

  // 创建情绪疗愈内容
  const healingItems = [
    { category: "PARENT" as const, type: "meditation", title: "晨起正念冥想", description: "5 分钟引导，开启清明的一天" },
    { category: "PARENT" as const, type: "meditation", title: "情绪急救练习", description: "愤怒或焦虑时的快速平复" },
    { category: "CHILD" as const, type: "story", title: "生气的小火山", description: "帮孩子认识愤怒的故事" },
    { category: "FAMILY" as const, type: "exercise", title: "情绪天气预报", description: "全家一起分享今日心情" },
  ];

  for (let i = 0; i < healingItems.length; i++) {
    await prisma.healingContent.upsert({
      where: { id: `healing-${i + 1}` },
      update: {},
      create: {
        id: `healing-${i + 1}`,
        ...healingItems[i],
        order: i + 1,
      },
    });
  }

  console.log("种子数据创建完成！");
  console.log("管理员账号: 13800000000");
  console.log("书籍: 在远远的背后带领");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
