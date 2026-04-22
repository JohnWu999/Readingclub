import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 使用绝对路径，避免 standalone 模式下相对路径解析问题
const dbPath = process.env.DATABASE_URL || 'file:/home/ubuntu/reading-club-new/prisma/dev.db'

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: dbPath,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
