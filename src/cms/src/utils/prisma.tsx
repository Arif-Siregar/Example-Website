import { PrismaClient } from '@prisma/client'

let prisma : PrismaClient
const globalforprisma = global as unknown as { prisma: PrismaClient }

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!globalforprisma.prisma) {
    globalforprisma.prisma = new PrismaClient()
  }
  prisma = globalforprisma.prisma
}

export default prisma