import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 获取用户的问题记录
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "需要 userId" }, { status: 400 });
    }

    const problem = await prisma.userProblem.findUnique({
      where: { userId }
    });

    if (!problem) {
      return NextResponse.json({ hasProblem: false });
    }

    return NextResponse.json({
      hasProblem: true,
      problems: JSON.parse(problem.problems || "[]"),
      childInfo: problem.childInfo
    });
  } catch (error) {
    console.error("Get user problem error:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

// 保存或更新用户的问题记录
export async function POST(req: NextRequest) {
  try {
    const { userId, problems, childInfo } = await req.json();
    
    if (!userId || !problems || !Array.isArray(problems)) {
      return NextResponse.json({ error: "参数错误" }, { status: 400 });
    }

    // 过滤空字符串
    const validProblems = problems.filter(p => p.trim().length > 0);
    
    if (validProblems.length === 0) {
      return NextResponse.json({ error: "至少填写一个问题" }, { status: 400 });
    }

    // upsert：存在则更新，不存在则创建
    const saved = await prisma.userProblem.upsert({
      where: { userId },
      update: {
        problems: JSON.stringify(validProblems),
        childInfo: childInfo || null
      },
      create: {
        userId,
        problems: JSON.stringify(validProblems),
        childInfo: childInfo || null
      }
    });

    // 生成章节洞察（异步执行，不阻塞响应）
    generateChapterInsights(userId, validProblems).catch(console.error);

    return NextResponse.json({
      success: true,
      problems: validProblems,
      childInfo: saved.childInfo
    });
  } catch (error) {
    console.error("Save user problem error:", error);
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}

// 为用户生成章节洞察（预计算章节与问题的关联）
async function generateChapterInsights(userId: string, problems: string[]) {
  try {
    // 获取所有章节
    const chapters = await prisma.chapter.findMany({
      where: { bookId: "book-1" },
      select: { id: true, title: true, content: true }
    });

    // 为每个问题和每个章节生成洞察
    for (const chapter of chapters) {
      for (const problem of problems.slice(0, 2)) { // 最多前2个问题
        // 简单关键词匹配来判断关联度
        const problemKeywords = problem.split(/[，。！？\s]+/);
        const chapterContent = (chapter.content || "").toLowerCase();
        
        let matchCount = 0;
        for (const kw of problemKeywords) {
          if (kw.length > 1 && chapterContent.includes(kw.toLowerCase())) {
            matchCount++;
          }
        }

        // 如果有一定关联度，创建洞察
        if (matchCount >= 1) {
          const hint = generateHint(problem, chapter.title);
          
          await prisma.chapterInsight.create({
            data: {
              chapterId: chapter.id,
              problemTag: problem.slice(0, 20),
              hint,
              quote: "", // 可以后续填充
              pageRef: ""
            }
          });
        }
      }
    }
  } catch (error) {
    console.error("Generate insights error:", error);
  }
}

// 生成提示语（不直接给答案，而是激发好奇心）
function generateHint(problem: string, chapterTitle: string): string {
  const hints = [
    `这一章可能会让你对"${problem.slice(0, 15)}..."有新的看法。`,
    `关于"${problem.slice(0, 15)}..."，作者在这里写了一个与你情况类似的案例。`,
    `这里有一段话，我觉得会触动到正在经历"${problem.slice(0, 10)}..."的你。`,
    `如果"${problem.slice(0, 15)}..."困扰着你，这一章值得仔细读。`,
    `作者在这里提到了一个角度，或许能帮你看清"${problem.slice(0, 10)}..."的本质。`,
  ];
  
  return hints[Math.floor(Math.random() * hints.length)];
}
