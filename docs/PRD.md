# 犟爸读书会 — 产品设计文档 (PRD)
> 版本: v1.0  
> 日期: 20260422  
> 作者: Hermes Agent

---

## 一、项目概述

### 1.1 产品定位
**犟爸读书会** 是一个面向付费会员的「读书 + 情绪成长」在线学习平台。以经典家庭教育书籍为载体，融合音频导读、章节讨论、打卡激励和情绪疗愈四大核心体验，帮助父母实现「从读书到改变」的闭环。

### 1.2 核心 slogan
> **在远远的背后带领 —— 读书，照见自己；情绪，滋养关系。**

### 1.3 目标用户
- 父母基本功 / APEF 付费会员
- 关注家庭教育和自我成长的家长
- 愿意通过读书+实践提升亲子关系的父母

---

## 二、功能架构

```
┌─────────────────────────────────────────────────────────┐
│                       犟爸读书会                          │
├──────────────┬──────────────┬──────────────┬────────────┤
│   📚 读书中心  │  🧘 情绪疗愈中心 │   👤 我的     │  ⚙️ 管理后台 │
├──────────────┼──────────────┼──────────────┼────────────┤
│ • 当前书目     │ • 父母情绪复原力  │ • 学习进度    │ • 书目管理   │
│ • 往期归档     │ • 孩子情绪小课堂  │ • 打卡日历    │ • 章节管理   │
│ • 阅读引导     │ • 亲子专区      │ • 我的评论    │ • 音频上传   │
│ • 音频导读     │                │ • 个人信息    │ • 用户管理   │
│ • 学习资料     │                │              │ • 数据统计   │
│ • 章节讨论     │                │              │            │
│ • 章节打卡     │                │              │            │
└──────────────┴──────────────┴──────────────┴────────────┘
```

---

## 三、模块详细设计

### 3.1 读书中心（核心模块）

#### 3.1.1 首页 - 书架视图
- 当前周期书目卡片（大图 + 书名 + 进度条 + 一句话推荐）
- 往期书目网格（封面 + 书名 + 已读人数）
- 快捷入口：继续阅读 / 今日打卡 / 情绪疗愈

#### 3.1.2 书页 - 单本书详情
**顶部导航**：阅读引导 | 音频导读 | 学习资料 | 讨论区

**阅读引导**
- 为什么读这本书？（300字导读）
- 本书核心观点提炼
- 阅读建议（每天读多少？怎么做笔记？）
- 作者介绍

**音频导读**
- 分章节播放器列表
- 每章：标题 + 时长 + 播放状态 + 完成标记
- 音频播放器：播放/暂停、进度条、倍速(0.5x-2x)、上一章/下一章、章节列表展开
- **进度记忆**：记录每个用户每章的播放进度，断点续播
- 音频来源标记：「真人录制」或「AI 克隆语音」

**学习资料**
- PDF 下载（笔记模板、思维导图、金句卡片）
- 图片素材（可长按保存分享）

**章节讨论区**
- 按章节分页，每章独立讨论串
- 发帖：文字 + 图片
- 回复：支持楼中楼
- 点赞 + 作者高亮（犟爸回复特殊标识）
- 精华帖置顶

**章节打卡**
- 听完本章音频后触发打卡按钮
- 打卡弹窗：今日收获（可选文字输入）
- 连续打卡天数统计

---

### 3.2 情绪疗愈中心（特色模块）

#### 3.2.1 父母情绪复原力（成人版块）
**定位**：帮助父母在育儿压力下恢复情绪能量的练习场

- **冥想音频**：5-10 分钟引导冥想
  - 晨起正念
  - 情绪急救（愤怒/焦虑时）
  - 睡前放松
- **情绪日记**：
  - 今日情绪选择器（😊 😐 😢 😠 😰）
  - 发生了什么？（文字记录）
  - 我做了什么？（行为回顾）
  - 下次可以怎么做？（转念练习）
- **复原力练习**：
  - 每日一念（正向 affirmations）
  - 自我关怀清单
  - 呼吸练习引导

#### 3.2.2 孩子情绪小课堂（孩子版块）
**定位**：用孩子能听懂的方式，帮助他们认识和管理情绪

- **情绪认知音频故事**：
  - 「生气的小火山」——认识愤怒
  - 「害怕的小影子」——认识恐惧
  - 「难过的小雨滴」——认识悲伤
  - 「开心的小太阳」——认识快乐
- **情绪表达游戏**：
  - 情绪卡片匹配
  - 「今天我是什么颜色」日记
- **睡前冥想故事**：5 分钟助眠音频

#### 3.2.3 亲子专区
**定位**：父母和孩子一起参与的情绪练习

- **亲子共练**：
  - 「情绪天气预报」——每天互相分享今天的情绪天气
  - 「拥抱时刻」——每天 1 分钟正念拥抱引导
  - 「家庭情绪公约」——共同制定（可编辑模板）
- **亲子互动打卡**：
  - 今日是否完成了「情绪天气预报」？
  - 连续打卡记录
- **家庭情绪墙**：
  - 家庭成员的情绪状态可视化
  - 本周家庭情绪关键词云

---

### 3.3 我的（个人中心）

- **学习进度**：
  - 当前书目阅读进度（%）
  - 已完成书目列表
- **打卡日历**：
  - 月度热力图（类似 GitHub contributions）
  - 读书打卡 + 情绪打卡 双轨显示
  - 连续打卡天数 + 总打卡天数
- **我的评论**：我发过的所有讨论帖
- **情绪日记本**：我的情绪日记记录（仅自己可见）
- **设置**：
  - 修改昵称/头像
  - 接收通知设置
  - 退出登录

---

### 3.4 管理后台（仅管理员）

- **书目管理**：创建/编辑/上架/下架书目
- **章节管理**：为书目添加章节（标题、音频文件、学习资料）
- **音频上传**：上传音频文件，标记类型（真人/AI）
- **资料管理**：上传 PDF/图片
- **评论管理**：审核、删除、置顶精华
- **用户管理**：查看会员列表、学习数据
- **数据看板**：
  - 活跃用户数
  - 音频播放次数
  - 打卡率
  - 讨论区热度

---

## 四、第一本书内容规划

### 《在远远的背后带领》 —— 安心 著

**书目信息**
- 作者：安心
- 副标题：PET父母效能训练的中国实践
- 周期：4 周精读
- 音频：约 15 章（每章 1 个音频，10-15 分钟）

**章节规划示例**
| 章节 | 标题 | 音频类型 | 时长 |
|------|------|----------|------|
| 导读 | 为什么推荐这本书 | 真人录制 | 8min |
| Ch1 | 不越界：什么是父母的边界 | 真人录制 | 12min |
| Ch2 | 不评判：放下对错，看见孩子 | AI克隆 | 10min |
| Ch3 | 负责任：养育的目标是什么 | AI克隆 | 11min |
| Ch4 | 无伤害：语言的力量与暴力 | AI克隆 | 13min |
| ... | ... | ... | ... |

**学习资料**
- PET 核心概念思维导图（PDF）
- 本书金句卡片（9张，可保存分享）
- 读书笔记模板（PDF）
- 「我信息」练习表（PDF）

---

## 五、技术架构

### 5.1 技术栈
| 层级 | 技术 |
|------|------|
| 前端框架 | Next.js 15 (App Router) + React 19 + TypeScript |
| 样式 | Tailwind CSS + shadcn/ui |
| 状态管理 | Zustand |
| 后端 | Next.js API Routes |
| ORM | Prisma |
| 数据库 | PostgreSQL 15 |
| 认证 | JWT + 短信验证码 |
| 文件存储 | 本地服务器 + 腾讯云 COS |
| 部署 | Ubuntu 22.04 (Hermes Server) + PM2 |
| 反向代理 | Nginx |

### 5.2 目录结构
```
reading-club/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 认证相关路由组
│   │   ├── login/                # 登录页
│   │   └── verify/               # 验证码页
│   ├── (main)/                   # 主界面路由组
│   │   ├── page.tsx              # 首页/书架
│   │   ├── book/[id]/            # 书页
│   │   │   ├── page.tsx          # 阅读引导
│   │   │   ├── audio/            # 音频导读
│   │   │   ├── discuss/          # 讨论区
│   │   │   └── materials/        # 学习资料
│   │   ├── healing/              # 情绪疗愈中心
│   │   │   ├── parent/           # 父母情绪复原力
│   │   │   ├── child/            # 孩子情绪小课堂
│   │   │   └── family/           # 亲子专区
│   │   ├── me/                   # 我的
│   │   │   ├── progress/         # 学习进度
│   │   │   ├── checkin/          # 打卡日历
│   │   │   ├── journal/          # 情绪日记
│   │   │   └── settings/         # 设置
│   │   └── layout.tsx            # 主布局（导航栏）
│   ├── admin/                    # 管理后台
│   └── api/                      # API 路由
│       ├── auth/                 # 认证相关
│       ├── books/                # 书目 API
│       ├── chapters/             # 章节 API
│       ├── audio/                # 音频 API
│       ├── comments/             # 评论 API
│       ├── checkin/              # 打卡 API
│       ├── healing/              # 情绪疗愈 API
│       └── upload/               # 文件上传
├── components/                   # 公共组件
│   ├── ui/                       # shadcn/ui 组件
│   ├── audio-player/             # 音频播放器
│   ├── checkin-calendar/         # 打卡日历
│   ├── comment-thread/           # 讨论串
│   └── emotion-picker/           # 情绪选择器
├── lib/                          # 工具函数
│   ├── prisma.ts                 # Prisma Client
│   ├── auth.ts                   # 认证工具
│   └── utils.ts                  # 通用工具
├── prisma/
│   └── schema.prisma             # 数据库 Schema
├── public/                       # 静态资源
│   ├── audio/                    # 音频文件
│   ├── images/                   # 图片
│   └── docs/                     # PDF 资料
├── types/                        # TypeScript 类型
└── package.json
```

---

## 六、数据库设计

### 6.1 E-R 关系图
```
User (1) ───< CheckIn (n)
User (1) ───< Comment (n)
User (1) ───< AudioProgress (n)
User (1) ───< EmotionJournal (n)
User (1) ───< FamilyMember (n)

Book (1) ───< Chapter (n)
Book (1) ───< Material (n)

Chapter (1) ───< AudioFile (n)
Chapter (1) ───< Comment (n) [where chapter_id is set]

HealingContent (1) ───< AudioFile (n)
```

### 6.2 核心表结构

#### User（用户）
```prisma
model User {
  id            String   @id @default(uuid())
  phone         String   @unique           // 手机号
  nickname      String?                     // 昵称
  avatar        String?                     // 头像 URL
  role          Role     @default(MEMBER)   // MEMBER | ADMIN
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  checkIns      CheckIn[]
  comments      Comment[]
  audioProgress AudioProgress[]
  journals      EmotionJournal[]
  familyMembers FamilyMember[]
}
```

#### Book（书目）
```prisma
model Book {
  id          String   @id @default(uuid())
  title       String                        // 书名
  subtitle    String?                       // 副标题
  author      String                        // 作者
  coverImage  String?                       // 封面图
  description String? @db.Text              // 简介
  readingGuide String? @db.Text             // 阅读引导
  cycleStart  DateTime?                     // 周期开始
  cycleEnd    DateTime?                     // 周期结束
  isActive    Boolean  @default(false)      // 是否当前周期
  isPublished Boolean  @default(false)      // 是否上架
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  
  chapters    Chapter[]
  materials   Material[]
}
```

#### Chapter（章节）
```prisma
model Chapter {
  id          String   @id @default(uuid())
  bookId      String
  title       String                        // 章节标题
  order       Int                           // 排序
  summary     String? @db.Text              // 章节摘要
  audioFiles  AudioFile[]
  materials   Material[]
  createdAt   DateTime @default(now())
  
  book        Book     @relation(fields: [bookId], references: [id])
  comments    Comment[]
}
```

#### AudioFile（音频文件）
```prisma
model AudioFile {
  id          String    @id @default(uuid())
  chapterId   String?
  healingId   String?   // 情绪疗愈内容ID
  title       String
  url         String                        // 文件路径
  duration    Int                           // 时长（秒）
  type        AudioType @default(HUMAN)     // HUMAN | AI_CLONE
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  
  chapter     Chapter?  @relation(fields: [chapterId], references: [id])
  progress    AudioProgress[]
}
```

#### AudioProgress（音频播放进度）
```prisma
model AudioProgress {
  id          String   @id @default(uuid())
  userId      String
  audioId     String
  position    Int      @default(0)          // 当前播放位置（秒）
  isCompleted Boolean  @default(false)      // 是否听完
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id])
  audio       AudioFile @relation(fields: [audioId], references: [id])
  
  @@unique([userId, audioId])
}
```

#### Comment（评论）
```prisma
model Comment {
  id        String   @id @default(uuid())
  userId    String
  chapterId String?
  content   String   @db.Text
  images    String[]                      // 图片 URLs
  parentId  String?                       // 回复某条评论
  isPinned  Boolean  @default(false)      // 置顶
  isEssence Boolean  @default(false)      // 精华
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id])
  chapter   Chapter? @relation(fields: [chapterId], references: [id])
  parent    Comment? @relation("Reply", fields: [parentId], references: [id])
  replies   Comment[] @relation("Reply")
}
```

#### CheckIn（打卡）
```prisma
model CheckIn {
  id          String     @id @default(uuid())
  userId      String
  type        CheckInType @default(READING) // READING | EMOTION | FAMILY
  chapterId   String?                        // 读书打卡关联章节
  content     String?    @db.Text            // 今日收获
  createdAt   DateTime   @default(now())
  
  user        User       @relation(fields: [userId], references: [id])
  
  @@unique([userId, type, createdAt])        // 每天每类型只能打一次
}
```

#### EmotionJournal（情绪日记）
```prisma
model EmotionJournal {
  id          String   @id @default(uuid())
  userId      String
  emotion     String                        // happy | neutral | sad | angry | anxious
  trigger     String?  @db.Text             // 发生了什么
  action      String?  @db.Text             // 我做了什么
  reflection  String?  @db.Text             // 下次怎么做
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id])
}
```

#### HealingContent（情绪疗愈内容）
```prisma
model HealingContent {
  id          String      @id @default(uuid())
  category    HealingCat  // PARENT | CHILD | FAMILY
  type        String      // meditation | story | exercise | game
  title       String
  description String?     @db.Text
  coverImage  String?
  order       Int         @default(0)
  isActive    Boolean     @default(true)
  createdAt   DateTime    @default(now())
  
  audioFiles  AudioFile[]
}
```

#### FamilyMember（家庭成员）
```prisma
model FamilyMember {
  id        String   @id @default(uuid())
  userId    String                        // 家长用户
  name      String                        // 成员昵称
  relation  String                        // child | partner | self
  avatar    String?
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## 七、API 设计

### 7.1 认证相关
```
POST /api/auth/send-code      # 发送短信验证码
POST /api/auth/verify-code    # 验证验证码并登录/注册
POST /api/auth/refresh        # 刷新 JWT
DELETE /api/auth/logout       # 登出
GET  /api/auth/me             # 获取当前用户信息
```

### 7.2 书目
```
GET  /api/books               # 书目列表
GET  /api/books/[id]          # 书目详情
POST /api/admin/books         # 创建书目（管理员）
PATCH /api/admin/books/[id]   # 更新书目
```

### 7.3 章节
```
GET  /api/books/[id]/chapters # 章节列表
GET  /api/chapters/[id]       # 章节详情（含音频列表）
```

### 7.4 音频
```
GET  /api/audio/[id]/stream   # 音频流式播放
POST /api/audio/progress      # 更新播放进度
GET  /api/audio/progress      # 获取播放进度列表
```

### 7.5 评论
```
GET  /api/chapters/[id]/comments      # 获取章节评论
POST /api/comments                    # 发表评论
POST /api/comments/[id]/reply         # 回复评论
DELETE /api/comments/[id]             # 删除评论
POST /api/admin/comments/[id]/pin     # 置顶评论
```

### 7.6 打卡
```
POST /api/checkin                     # 打卡
GET  /api/checkin/calendar            # 获取打卡日历数据
GET  /api/checkin/streak              # 获取连续打卡天数
```

### 7.7 情绪疗愈
```
GET  /api/healing?category=parent     # 获取疗愈内容列表
POST /api/journal                     # 写情绪日记
GET  /api/journal                     # 获取情绪日记列表
```

### 7.8 文件上传
```
POST /api/upload/audio                # 上传音频
POST /api/upload/image                # 上传图片
POST /api/upload/doc                  # 上传文档
```

---

## 八、页面设计规范

### 8.1 视觉风格
延续「爱马仕风格」：
- **主色**: `#E85D04`（ burnt orange 焦橙色）
- **金色**: `#C9A961`
- **背景**: `#FAF7F2`（米色/奶油色）
- **文字**: `#2D2D2D`（深灰）+ `#666666`（辅助文字）
- **字体**: Noto Serif SC（标题）+ system-ui（正文）
- **设计原则**: 极简、大量留白、精致金线装饰

### 8.2 布局规范
- 移动端优先（用户主要用手机访问）
- 最大宽度 768px，居中显示
- 底部固定导航栏（4 个 Tab）
- 顶部标题栏固定

### 8.3 导航结构
```
底部 Tab Bar:
┌─────────┬─────────┬─────────┬─────────┐
│  书架   │  疗愈   │  打卡   │   我的  │
│  📚    │  🧘    │  ✅    │  👤    │
└─────────┴─────────┴─────────┴─────────┘
```

---

## 九、音频播放器设计

### 9.1 播放器状态
- **收起态**：底部迷你播放器（书名 + 播放/暂停 + 进度条）
- **展开态**：全屏播放器（封面 + 标题 + 大进度条 + 控制按钮）

### 9.2 控制功能
- 播放 / 暂停
- 进度拖拽
- 上一章 / 下一章
- 倍速切换（0.5x / 0.8x / 1x / 1.25x / 1.5x / 2x）
- 章节列表展开
- 定时关闭（15min / 30min / 45min / 播完本章）

### 9.3 进度记忆
- 每 5 秒自动保存播放进度到服务器
- 重新进入自动恢复到上次位置
- 完成 95% 以上标记为「已听完」

---

## 十、打卡系统设计

### 10.1 打卡类型
- `READING`：读书打卡（听完一章音频）
- `EMOTION`：情绪日记打卡（写了一条日记）
- `FAMILY`：亲子互动打卡（完成亲子专区练习）

### 10.2 打卡规则
- 每天每类型可打 1 次
- 读书打卡必须听完本章音频才能打
- 连续打卡中断后重新计数

### 10.3 打卡日历
- 月度视图
- 用不同颜色区分打卡类型
- 橙色 = 读书，绿色 = 情绪，蓝色 = 亲子
- hover 显示当天打卡详情

---

## 十一、第一版本 MVP 范围

### v1.0（第 1-2 周）
- [ ] 手机号登录系统
- [ ] 首页书架 + 书页阅读引导
- [ ] 音频播放器（含进度记忆）
- [ ] 分章节讨论区（发帖+回复）
- [ ] 章节打卡 + 连续天数统计
- [ ] 管理后台（上传音频、创建书目）

### v1.1（第 3-4 周）
- [ ] 打卡日历热力图
- [ ] 情绪疗愈中心（父母版块）
- [ ] 学习资料下载
- [ ] 往期书目归档

### v1.2（第 5-6 周）
- [ ] 孩子情绪小课堂
- [ ] 亲子专区
- [ ] 情绪日记
- [ ] 数据统计看板

---

## 十二、部署方案

### 12.1 服务器配置
- **服务器**: Hermes Server (159.75.144.28)
- **域名**: 待定（建议 reading.jiangba.com 或类似）
- **SSL**: Let's Encrypt

### 12.2 部署流程
```bash
# 1. 代码推送 GitHub
# 2. 服务器拉取代码
# 3. 安装依赖 + 构建
# 4. 数据库迁移
# 5. PM2 重启服务
```

### 12.3 自动部署
配置 GitHub Actions 或 Git webhook 实现 push 即部署。

---

## 十三、后续扩展规划

- **AI 音色克隆**：接入豆包 Seed-TTS，用犟爸声音批量生成音频
- **飞书通知**：打卡提醒、新讨论提醒推送到飞书
- **积分系统**：打卡/发帖获得积分，兑换内容
- **线下活动**：读书会线上报名 + 线下签到
- **小程序版**：微信小程度适配

---

> **备注**: 本 PRD 为 v1.0 版本，后续根据实际开发进度和用户反馈迭代更新。
