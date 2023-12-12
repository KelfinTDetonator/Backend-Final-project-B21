const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
    user : prisma.users,
    profile : prisma.Profile,
    category : prisma.category,
    course : prisma.course,
    order: prisma.order,
    chapter: prisma.chapter,
    material: prisma.material,
    notification : prisma.notifications
}