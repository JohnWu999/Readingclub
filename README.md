# 犟爸书房

父母基本功读书会 — 一个专为家长打造的在线读书社区。

**Production:** http://159.75.144.28

## Features

- 📚 **精读周期** — 每期一本好书，系统式阅读
- 🎧 **音频讲解** — 人声 + AI 克隆双语音，支持进度记录
- ✅ **每日打卡** — 阅读、情绪、家庭三维度打卡
- 💬 **评论讨论** — 章节讨论区，支持回复
- 🌟 **疗愈空间** — 父母、孩子、家庭三大疗愈板块

## Tech Stack

- Next.js 16 + TypeScript + Tailwind CSS
- Prisma ORM + SQLite
- shadcn/ui + Zustand

## Development

```bash
npm install
npx prisma generate
npm run dev
```

## Deploy

```bash
npm run build
# rsync .next/ to server, then: pm2 restart reading-club
```

## License

MIT
