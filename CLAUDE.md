# 犟爸书房 (Reading Club)

## Project Overview

父母基本功读书会网站 — 一个专为家长打造的在线读书社区。支持音频讲解、每日打卡、评论讨论、疗愈内容等功能。

**Production URL:** http://159.75.144.28
**Server:** Hermes Server (Ubuntu 22.04)
**Deploy Path:** /home/ubuntu/reading-club-new

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Database:** Prisma ORM + SQLite
- **Auth:** bcryptjs + jsonwebtoken
- **State:** Zustand
- **Icons:** lucide-react
- **Font:** Noto Serif SC (Google Fonts)

## Design System

- **Primary:** #E85D04 (burnt orange)
- **Gold:** #C9A961
- **Background:** #FAF7F2 (cream)
- **Text:** #2D2D2D
- **Secondary Text:** #666666
- **Border:** rgba(201, 169, 97, 0.3)
- **Radius:** 0.75rem
- **Style:** Minimal, generous whitespace, gold line decorations

## Architecture

```
app/
├── (auth)/           # Auth route group (no layout)
│   └── login/         # Login page
├── (main)/           # Main app route group
│   ├── page.tsx       # Homepage (犟爸书房)
│   ├── healing/       # 疗愈页面
│   ├── me/            # 个人中心
│   │   └── checkin/   # 打卡页面
│   └── book/[id]/     # 书籍详情
├── api/              # API routes
│   ├── auth/          # Login, register, me
│   ├── books/         # Book CRUD
│   ├── audio/         # Audio progress
│   ├── checkin/       # Check-in
│   └── comments/      # Comments
└── layout.tsx        # Root layout

prisma/
└── schema.prisma       # Full data model
```

## Database Models

- **User** - Members & admins
- **Book** - Reading cycle books
- **Chapter** - Book chapters
- **AudioFile** - Audio content (human & AI clone)
- **AudioProgress** - User listening progress
- **Comment** - Chapter discussions with replies
- **CheckIn** - Daily reading/emotion/family check-ins
- **EmotionJournal** - Emotion tracking
- **HealingContent** - Parent/child/family healing
- **FamilyMember** - Family member profiles
- **Material** - Learning materials (PDF, etc.)

## Environment

```
DATABASE_URL=file:/path/to/prisma/dev.db
```

## Available Scripts

```bash
npm run dev      # Development
npm run build    # Production build
npm start        # Start production server
```

## Deployment

Build locally, rsync `.next/` to server, PM2 restart.

```bash
npm run build
rsync -avz --delete .next/ ubuntu@159.75.144.28:~/reading-club-new/.next/
ssh ubuntu@159.75.144.28 "pm2 restart reading-club"
```

## gstack Skills

Use these skills for all AI-assisted work on this project:

- `/office-hours` - Product thinking before coding
- `/plan-ceo-review` - Scope and product direction review
- `/plan-eng-review` - Architecture and data flow locking
- `/review` - Code review (auto-fix + flag gaps)
- `/qa` - Browser QA testing
- `/ship` - Release: sync, test, PR
- `/cso` - Security audit (OWASP + STRIDE)
- `/browse` - All web browsing (never use mcp__claude-in-chrome tools)
