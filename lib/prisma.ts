import { PrismaClient } from "@prisma/client"

// PrismaClient é anexado ao objeto global em ambientes de desenvolvimento para evitar
// múltiplas instâncias do Prisma Client em hot-reloading
declare global {
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
