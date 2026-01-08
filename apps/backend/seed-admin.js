
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@btech-freelancing.com' },
        update: {
            role: 'ADMIN'
        },
        create: {
            name: 'System Admin',
            email: 'admin@btech-freelancing.com',
            password: hashedPassword,
            role: 'ADMIN',
            adminProfile: {
                create: {
                    headline: 'Platform Super Admin',
                    bio: 'Responsible for maintaining system integrity and user management.',
                    department: 'Engineering',
                    contactPhone: '+91-9856895456'
                }
            }
        },
    });

    console.log('Created Admin:', admin);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
