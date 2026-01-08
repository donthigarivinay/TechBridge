
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://neondb_owner:npg_WK9NxbLiyut5@ep-broad-credit-a1j96ise-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
        },
    },
});

async function main() {
    console.log('Testing connection...');
    try {
        await prisma.$connect();
        console.log('Connection successful!');
        const users = await prisma.user.count();
        console.log('User count:', users);
    } catch (e) {
        console.error('Connection failed:');
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
