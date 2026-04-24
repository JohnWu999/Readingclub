import { DatabaseSync } from 'node:sqlite';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'dev.db');
const db = new DatabaseSync(dbPath);

// Add content column if not exists
try {
  db.exec(`ALTER TABLE Chapter ADD COLUMN content TEXT;`);
  console.log('Added content column');
} catch (e) {
  console.log('content column may already exist:', e.message);
}

// Read chapter contents
const chaptersDir = '/tmp/chapters';
const chapterMap = {
  'ch-1': { title: '导读：推荐序与自序', file: '导读.txt' },
  'ch-2': { title: 'Ch1 不越界：什么是父母的边界', file: 'Ch1_不越界.txt' },
  'ch-3': { title: 'Ch2 不评判：放下对错，看见孩子', file: 'Ch2_不评判.txt' },
  'ch-4': { title: 'Ch3 负责任：养育的目标是什么', file: 'Ch3_负责任.txt' },
  'ch-5': { title: 'Ch4 无伤害：语言的力量与暴力', file: 'Ch4_无伤害.txt' },
  'ch-6': { title: 'Ch5 一致性：做真实的父母', file: 'Ch5_一致性.txt' },
  'ch-7': { title: 'Ch6 自我调整：拥抱情绪与转念', file: 'Ch6_自我调整.txt' },
};

for (const [id, info] of Object.entries(chapterMap)) {
  const content = fs.readFileSync(join(chaptersDir, info.file), 'utf-8');
  const summary = content.slice(0, 300).replace(/\n/g, ' ').trim() + '...';

  db.prepare(`UPDATE Chapter SET title = ?, summary = ?, content = ? WHERE id = ?`)
    .run(info.title, summary, content, id);

  console.log(`Updated ${id}: ${info.title} (${content.length} chars)`);
}

// Verify
const rows = db.prepare(`SELECT id, title, LENGTH(content) as content_len, LENGTH(summary) as summary_len FROM Chapter ORDER BY "order"`).all();
console.log('\nVerification:');
for (const row of rows) {
  console.log(`  ${row.id}: ${row.title} | content=${row.content_len} | summary=${row.summary_len}`);
}

db.close();
console.log('\n✅ 数据库更新完成');
