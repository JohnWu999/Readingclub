import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'dev.db');
const db = new DatabaseSync(dbPath);

// 清空
db.exec(`
  DELETE FROM AudioProgress;
  DELETE FROM Comment;
  DELETE FROM CheckIn;
  DELETE FROM EmotionJournal;
  DELETE FROM FamilyMember;
  DELETE FROM Material;
  DELETE FROM AudioFile;
  DELETE FROM Chapter;
  DELETE FROM HealingContent;
  DELETE FROM Book;
  DELETE FROM User;
`);

const now = new Date().toISOString();
const bcryptHash = '$2a$10$abcdefghijklmnopqrstuv';

// 管理员
db.prepare(`INSERT INTO User (id, phone, password, nickname, role, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
  .run('user-admin', '13800000000', bcryptHash, '犟爸', 'ADMIN', 1, now, now);

// 书籍
db.prepare(`INSERT INTO Book (id, title, subtitle, author, description, readingGuide, isActive, isPublished, "order", createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  .run('book-1', '在远远的背后带领', 'PET父母效能训练的中国实践', '安心',
    '这是一本关于“如何成为一个不控制、不评判、却能深度影响孩子”的书。',
    '【为什么读这本书？】\n\n安心老师将 PET 的核心理念与中国家庭的实际情况相结合。',
    1, 1, 1, now);

// 章节
const chapters = [
  { id: 'ch-1', title: '导读：为什么推荐这本书', order: 1 },
  { id: 'ch-2', title: 'Ch1 不越界：什么是父母的边界', order: 2 },
  { id: 'ch-3', title: 'Ch2 不评判：放下对错，看见孩子', order: 3 },
  { id: 'ch-4', title: 'Ch3 负责任：养育的目标是什么', order: 4 },
  { id: 'ch-5', title: 'Ch4 无伤害：语言的力量与暴力', order: 5 },
  { id: 'ch-6', title: 'Ch5 共情：走进孩子的内心世界', order: 6 },
  { id: 'ch-7', title: 'Ch6 我信息：表达真实的自己', order: 7 },
];

for (const ch of chapters) {
  db.prepare(`INSERT INTO Chapter (id, bookId, title, "order", createdAt) VALUES (?, ?, ?, ?, ?)`)
    .run(ch.id, 'book-1', ch.title, ch.order, now);
  const duration = 600 + Math.floor(Math.random() * 300);
  const type = ch.order <= 2 ? 'HUMAN' : 'AI_CLONE';
  db.prepare(`INSERT INTO AudioFile (id, chapterId, title, url, duration, type, "order", createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(`audio-${ch.order}`, ch.id, ch.title, `/audio/chapter-${ch.order}.mp3`, duration, type, 1, now);
}

// 资料
const materials = [
  { id: 'mat-1', title: 'PET 核心概念思维导图', type: 'pdf', url: '/docs/pet-mindmap.pdf' },
  { id: 'mat-2', title: '本书金句卡片', type: 'image', url: '/docs/quotes.zip' },
  { id: 'mat-3', title: '读书笔记模板', type: 'pdf', url: '/docs/note-template.pdf' },
];
for (let i = 0; i < materials.length; i++) {
  db.prepare(`INSERT INTO Material (id, bookId, title, url, type, "order", createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(materials[i].id, 'book-1', materials[i].title, materials[i].url, materials[i].type, i + 1, now);
}

// 疗愈内容
const healingItems = [
  { id: 'heal-1', category: 'PARENT', type: 'meditation', title: '晨起正念冥想', desc: '5 分钟引导，开启清明的一天' },
  { id: 'heal-2', category: 'PARENT', type: 'meditation', title: '情绪急救练习', desc: '愤怒或焦虑时的快速平复' },
  { id: 'heal-3', category: 'CHILD', type: 'story', title: '生气的小火山', desc: '帮孩子认识愤怒的故事' },
  { id: 'heal-4', category: 'FAMILY', type: 'exercise', title: '情绪天气预报', desc: '全家一起分享今日心情' },
];
for (let i = 0; i < healingItems.length; i++) {
  db.prepare(`INSERT INTO HealingContent (id, category, type, title, description, "order", isActive, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(healingItems[i].id, healingItems[i].category, healingItems[i].type, healingItems[i].title, healingItems[i].desc, i + 1, 1, now);
}

// 示例评论
db.prepare(`INSERT INTO Comment (id, userId, chapterId, content, images, isPinned, isEssence, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
  .run('comment-1', 'user-admin', 'ch-2',
    '第一章就被震慑到了！我之前总是习惯性地帮孩子做决定，原来这是在侵犯他的边界。今天试着问了孩子“你想怎么做？”，看到他眼睛里的光，突然觉得好久没见到了。',
    '', 0, 1, now);

console.log('✅ 种子数据创建完成！');
console.log('📚 书籍：在远远的背后带领');
console.log('📜 章节：7 章');
console.log('🎧 音频：7 个');
console.log('📄 资料：3 份');
console.log('🧘 疗愈内容：4 项');
console.log('💬 示例评论：1 条');

db.close();
