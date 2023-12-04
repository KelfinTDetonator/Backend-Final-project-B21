const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = {
    user : prisma.users,
    profiles : prisma.Profile,
    category : prisma.course,
    course : prisma.course,
    order: prisma.order,
    chapter: prisma.chapter,
    material: prisma.material
}