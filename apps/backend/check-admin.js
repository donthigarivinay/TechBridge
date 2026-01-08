
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
    });
    console.log('Admin user found:', admin);

    const allUsers = await prisma.user.findMany();
    console.log('Total users:', allUsers.length);
    console.log('User roles:', allUsers.map(u => u.role));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
