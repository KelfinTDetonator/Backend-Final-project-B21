const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

module.exports = {
    users: prisma.users,
    profile: prisma.profile
}