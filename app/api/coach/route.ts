import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 工具卡片定义
const TOOL_CARDS: Record<string, {
  name: string;
  icon: string;
  formula: string;
  example: string;
  chapter: string;
  page: string;
}> = {
  "我信息": {
    name: "我信息",
    icon: "🗣️",
    formula: "当...（客观描述），我感到...（感受），因为...（影响）",
    example: "当你玩了两个小时手机，我很担心你的眼睛和明天的精神状态。",
    chapter: "第五章 无伤害",
    page: "P.127"
  },
  "积极倾听": {
    name: "积极倾听",
    icon: "👂",
    formula: "反馈感受 + 邀请继续",
    example: "听起来你很沮丧，想多跟我说说吗？",
    chapter: "第四章 不评判",
    page: "P.98"
  },
  "第三法": {
    name: "第三法",
    icon: "🤝",
    formula: "定义需求 → 头脑风暴 → 评估方案 → 达成共识",
    example: "我们都希望... 你觉得我们可以怎么做？",
    chapter: "第六章 一致性",
    page: "P.156"
  },
  "行为窗口": {
    name: "行为窗口",
    icon: "🪟",
    formula: "谁在问题区？谁有情绪？需求是否被影响？",
    example: "这件事影响了谁的需求？",
    chapter: "第一章 不越界",
    page: "P.23"
  }
};

// 关键词映射
const KEYWORDS_MAP: Record<string, string[]> = {
  "越界": ["不越界", "界限", "问题区", "夹菜", "催婚", "代做决定", "控制"],
  "评判": ["不评判", "好对错", "应该", "怎么不", "那么笨", "批评"],
  "伤害": ["无伤害", "我信息", "你信息", "面质", "打击", "讽刺", "吼", "骂"],
  "冲突": ["冲突", "第三法", "双赢", "协商", "解决方案", "吵架", "争执"],
  "情绪": ["情绪", "生气", "愤怒", "焦虑", "悲伤", "发火", "大哭"],
  "倾听": ["倾听", "积极倾听", "反应", "沟通", "不理我"],
  "作业": ["作业", "学习", "磨蹭", "拖延", "不想写", "拖拉"],
  "手机": ["手机", "游戏", "限制", "时间", "戒不掉", "沉迷"],
  "老人": ["老人", "父母", "公婆", "干预", "带孩子", "隔代", "婆婆", "丈母娘"],
};

export async function POST(req: NextRequest) {
  try {
    const { question, conversationId, userId } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "请提供问题" }, { status: 400 });
    }

    // 1. 分析关键词，确定相关工具
    const detectedTools: string[] = [];
    for (const [category, keywords] of Object.entries(KEYWORDS_MAP)) {
      if (keywords.some((k) => question.includes(k))) {
        if (category === "越界") detectedTools.push("行为窗口", "我信息");
        if (category === "评判") detectedTools.push("积极倾听", "我信息");
        if (category === "冲突") detectedTools.push("第三法", "我信息");
        if (category === "情绪") detectedTools.push("行为窗口", "我信息");
        if (category === "作业" || category === "手机") detectedTools.push("我信息", "第三法");
        if (category === "老人") detectedTools.push("我信息", "积极倾听");
        if (category === "伤害") detectedTools.push("我信息");
        if (category === "倾听") detectedTools.push("积极倾听");
      }
    }

    const uniqueTools = [...new Set(detectedTools)];
    const primaryToolKey = uniqueTools[0] || "行为窗口";
    const toolCard = TOOL_CARDS[primaryToolKey];

    // 2. 获取用户的问题记录（如果有）
    let userContext = "";
    if (userId) {
      const userProblem = await prisma.userProblem.findUnique({
        where: { userId }
      });
      if (userProblem) {
        const problems = JSON.parse(userProblem.problems || "[]");
        userContext = `用户之前提到的困扰：${problems.join('、')}`;
      }
    }

    // 3. 构建引导式 Prompt（新风格：共情 + 提问 + 不直接给答案）
    const prompt = `你是安心，《在远远的背后带领》作者，P.E.T.父母效能训练中国督导。

你的对话风格：
- 像一位温暖、有经验的朋友，不评判、不说教
- **先共情，再提问** —— 不直接给答案，而是用问题引导对方思考
- **用"我注意到..."代替"你应该..."**
- **用提问代替指令**："你觉得...？" "我好奇..." "会不会是..."
- 认可对方的情绪，让他感觉被看见

用户的问题："""${question}"""

${userContext}

可能的工具方向：${primaryToolKey}

请按以下方式回应（自然对话，不要分点1234）：

**第一步：共情与确认**
- 先描述你感受到的用户情绪（愤怒？无力？焦虑？）
- 用一句话让他知道"这种感觉是正常的"

**第二步：好奇地提问**
- 问一个能帮他理清思路的问题（不是"为什么"，而是"是什么""怎么样"）
- 例如："我好奇的是，当你说...的时候，你自己身体有什么感觉？"
- 或者："在那个瞬间，你最希望发生什么？"

**第三步：轻推一把（如果合适）**
- 如果需要，可以轻轻地提及书中的视角，但不直接给答案
- 例如："书中有一句话让我想到你..."（引用一句，但不解释）
- 或者："这让我想到${primaryToolKey}这个概念..."（只提名字，不展开）

**第四步：邀请**
- 邀请他多说一点，或邀请他试试某个小实验
- 例如："如果你愿意，可以跟我多说说..." 或 "下次这种情况发生，你愿意试试...？"

关键原则：
- 不要一次性给太多建议
- 不要解释概念，只是提及
- 让用户感觉被倾听，而不是被教导
- 每次只聚焦一个点
`;

    // 4. 调用 API
    const apiKey = process.env.MINIMAX_API_KEY || process.env.KIMI_API_KEY || process.env.OPENROUTER_API_KEY;
    const baseUrl = process.env.MINIMAX_BASE_URL || process.env.KIMI_BASE_URL || "https://api.minimax.chat/v1";
    
    let answer: string;
    
    if (apiKey) {
      try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: process.env.MINIMAX_MODEL || process.env.KIMI_MODEL || "MiniMax-M2.5",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
            max_tokens: 600,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          let content = data.choices?.[0]?.message?.content || "";
          // 清理 MiniMax thinking 标签
          content = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
          answer = content || generateFallbackAnswer(question, primaryToolKey, toolCard);
        } else {
          const errText = await response.text();
          console.error("AI API error:", response.status, errText);
          answer = generateFallbackAnswer(question, primaryToolKey, toolCard);
        }
      } catch (apiErr) {
        console.error("AI API call failed:", apiErr);
        answer = generateFallbackAnswer(question, primaryToolKey, toolCard);
      }
    } else {
      console.warn("No API key configured, using fallback answer");
      answer = generateFallbackAnswer(question, primaryToolKey, toolCard);
    }

    // 5. 保存对话（如果有 userId）
    if (userId) {
      let convId = conversationId;
      
      if (!convId) {
        // 创建新对话
        const newConv = await prisma.conversation.create({
          data: {
            userId,
            bookId: "book-1",
            title: question.slice(0, 30) + "..."
          }
        });
        convId = newConv.id;
      }

      // 保存用户消息
      await prisma.message.create({
        data: {
          conversationId: convId,
          role: "user",
          content: question
        }
      });

      // 保存AI回复
      await prisma.message.create({
        data: {
          conversationId: convId,
          role: "assistant",
          content: answer,
          toolRefs: JSON.stringify([{
            name: toolCard.name,
            page: toolCard.page,
            quote: toolCard.formula
          }])
        }
      });
    }

    return NextResponse.json({
      answer,
      toolCard,
      conversationId: conversationId || undefined,
    });

  } catch (error) {
    console.error("Coach API error:", error);
    return NextResponse.json(
      { error: "服务暂时不可用" },
      { status: 500 }
    );
  }
}

// 后备回答（根据问题内容个性化）
function generateFallbackAnswer(
  question: string,
  toolKey: string,
  toolCard?: { name: string; formula: string; example: string }
): string {
  const q = question.toLowerCase();
  
  // 情绪检测
  const emotions = {
    angry: /生气|愤怒|发火|暴怒|恼火|烦躁|受不了/.test(q),
    sad: /难过|伤心|哭|委屈|失望|绝望|无助/.test(q),
    anxious: /焦虑|担心|害怕|紧张|不安|恐慌|睡不着/.test(q),
    tired: /累|疲惫| exhaustion|撑不住|筋疲力尽/.test(q),
    confused: /困惑|迷茫|不知道|怎么办|不懂|不明白/.test(q),
  };
  
  // 场景检测
  const scenarios = {
    homework: /作业|写作业|学习|磨蹭|拖拉|不专心|考试|成绩/.test(q),
    phone: /手机|游戏|ipad|平板|电视|沉迷|放不下|屏幕/.test(q),
    elderly: /老人|婆婆|公公|丈母娘|父母|干预|带孩子|隔代/.test(q),
    boundary: /越界|界限|控制|干涉|管太多|没自由|不尊重/.test(q),
    emotion: /情绪|发脾气|哭闹|大喊大叫|摔东西|冷战/.test(q),
    communication: /沟通|不理我|不说话|沉默|拒绝交流|说不动/.test(q),
    sibling: /打架|争抢|二胎|兄弟姐妹|抢玩具|不公平/.test(q),
    sleep: /睡觉|晚睡|睡不着|作息|熬夜|起床困难/.test(q),
  };

  // 共情开头（根据情绪）
  const empathyStarters: string[] = [];
  if (emotions.angry) {
    empathyStarters.push("我能感觉到你现在很愤怒。这种被反复挑战底线的感觉，真的很消耗人。");
    empathyStarters.push("愤怒本身没有错，它是在告诉你：这里有一个对你来说很重要的界限。");
  } else if (emotions.sad) {
    empathyStarters.push("听起来你心里挺难受的。为人父母，有时候最痛的恰恰是那份无力感。");
    empathyStarters.push("委屈和伤心都是真实的感受。你愿意说出来，本身就是一种勇气。");
  } else if (emotions.anxious) {
    empathyStarters.push("焦虑的时候，脑子里像有一台停不下来的机器。这种感受我懂。");
    empathyStarters.push("担心未来是很自然的。但别忘了，你已经尽了你当下能做的最好的努力。");
  } else if (emotions.tired) {
    empathyStarters.push("累，不只是身体的，更是心里的。你一直在付出，这本身就很不容易。");
    empathyStarters.push("疲惫是一种信号，它在提醒你：该照顾自己了。你不是无限能源。");
  } else if (emotions.confused) {
    empathyStarters.push("迷茫的时候，其实说明你在认真思考。不是所有人都会停下来问自己“对不对”。");
    empathyStarters.push("不知道怎么办，这很正常。养育没有标准答案，我们都在摸索。");
  } else {
    empathyStarters.push("谢谢你愿意跟我分享这些。我感觉到这对你来说是件重要的事。");
    empathyStarters.push("听起来这件事已经在你心里盘旋一阵子了。能说说它对你意味着什么吗？");
  }

  // 提问（根据场景）
  const questions: string[] = [];
  if (scenarios.homework) {
    questions.push("我好奇的是，当孩子磨蹭的时候，那一刻你心里最强烈的感受是什么？是着急？还是无力？");
    questions.push("作业这件事，对你和孩子分别意味着什么？它只是一个任务，还是承载了更多东西？");
  } else if (scenarios.phone) {
    questions.push("当孩子抱着手机不放的时候，你最担心的是什么？是眼睛？学习？还是你觉得被忽视了？");
    questions.push("如果手机突然消失了，孩子会用什么东西来填补那个空白？这个问题值得想一想。");
  } else if (scenarios.elderly) {
    questions.push("老人干预的时候，你感受到的更多是委屈，还是一种'我的地盘被侵犯了'的感觉？");
    questions.push("在老人和你的教育理念之间，孩子自己是怎么看的？你有没有好奇过他的感受？");
  } else if (scenarios.boundary) {
    questions.push("越界这件事，是对方真的越过了，还是你们对'界限'的理解本来就不一样？");
    questions.push("当你说'不要管我'的时候，你真正想说的是什么？是'请尊重我'，还是'我不需要帮忙'？");
  } else if (scenarios.emotion) {
    questions.push("当孩子情绪爆发的时候，你自己身体有什么反应？心跳加速？想逃跑？还是也想发火？");
    questions.push("那个情绪背后，孩子真正想表达的是什么？是需求没被满足，还是只是需要被看见？");
  } else if (scenarios.communication) {
    questions.push("当沟通断掉的时候，你是什么感觉？是挫败？还是一种'我说什么都没用'的放弃感？");
    questions.push("你有没有试过，不说'你应该'，而是说'我发现'？变化有时候就在一个词里。");
  } else if (scenarios.sibling) {
    questions.push("争抢背后，每个孩子真正想要的是什么？是东西本身，还是'爸爸妈妈更重视我'？");
    questions.push("作为父母，你心里的天平真的平衡吗？还是你也在为'公平'而焦虑？");
  } else if (scenarios.sleep) {
    questions.push("晚睡这件事，对孩子和你分别意味着什么？是习惯问题，还是一天中唯一属于自己的时间？");
    questions.push("如果抛开'应该几点睡'的标准，你真正担心的是什么？");
  } else {
    questions.push("在那个让你困扰的瞬间，如果暂停一下，你最希望发生什么？");
    questions.push("这件事如果持续一年不变，你最害怕的结果是什么？那个恐惧背后藏着什么？");
  }

  // 轻推（工具提示）
  const nudges: string[] = [];
  if (toolCard) {
    nudges.push(`这让我想到「${toolCard.name}」——${toolCard.formula}。不是要你立刻用，只是提供一个视角。`);
    nudges.push(`书里有这样一个工具叫「${toolCard.name}」，核心思路是：${toolCard.formula}。你觉得这个方向跟你现在的情况有关联吗？`);
  } else {
    nudges.push("有时候，换一个角度去看同一件事，答案就自己浮现了。不急，慢慢来。");
    nudges.push("安心在书里说了很多关于'看见'的故事。有时候被看见本身，就是一种解法。");
  }

  // 邀请
  const invitations = [
    "如果你愿意，可以多跟我说说当时的细节。说出来，本身就是一种整理。",
    "不用急着找到答案。我们先把它看清楚，答案通常藏在你还没说完的话里。",
    "你刚才提到的某个点，我想更深入地了解。你愿意展开说说吗？",
    "下次类似的情况发生，你愿意试试用不同的方式回应吗？哪怕只是一个小小的变化。",
  ];

  // 组合回答
  const starter = empathyStarters[Math.floor(Math.random() * empathyStarters.length)];
  const pickedQuestion = questions[Math.floor(Math.random() * questions.length)];
  const nudge = nudges[Math.floor(Math.random() * nudges.length)];
  const invitation = invitations[Math.floor(Math.random() * invitations.length)];

  return `${starter}\n\n${pickedQuestion}\n\n${nudge}\n\n${invitation}`;
}

// 获取对话历史
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "需要 userId" }, { status: 400 });
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Get conversations error:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}
