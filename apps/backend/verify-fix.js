const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
    console.log('Starting verification...');

    // 1. Find an admin user
    const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        include: { adminProfile: true }
    });

    if (!adminUser) {
        console.error('No admin user found! Please seed an admin first.');
        return;
    }
    console.log('Found Admin:', adminUser.name, adminUser.id);

    // Ensure admin profile exists
    if (!adminUser.adminProfile) {
        console.log('Creating Admin Profile...');
        await prisma.adminProfile.create({ data: { userId: adminUser.id } });
    }

    // 2. Create a dummy pending project
    const project = await prisma.project.create({
        data: {
            title: 'Verification Project ' + Date.now(),
            description: 'Test project for verification',
            budget: 5000,
            status: 'PENDING_APPROVAL',
            clientId: adminUser.id, // Just using admin as client for simplicity, or find a client
        }
    });
    console.log('Created Pending Project:', project.id);

    // 3. Simulate "Approve" (Controller logic)
    console.log('approving project...');
    await prisma.project.update({
        where: { id: project.id },
        data: {
            status: 'OPEN',
            adminId: adminUser.id
        }
    });

    // 4. Verify Admin Profile Query (Service logic)
    console.log('Fetching Admin Profile...');
    const profile = await prisma.adminProfile.findUnique({
        where: { userId: adminUser.id },
        include: {
            user: {
                include: {
                    adminProjects: {
                        where: {
                            status: { in: ['OPEN', 'IN_PROGRESS'] }
                        },
                    }
                }
            }
        },
    });

    // 5. Check results
    const foundProject = profile.user.adminProjects.find(p => p.id === project.id);

    if (foundProject) {
        console.log('SUCCESS: Project found in Admin Profile "Managed Projects" list!');
        console.log('Project Details:', foundProject);
    } else {
        console.error('FAILURE: Project NOT found in Admin Profile list.');
        console.log('Admin Projects found:', profile.user.adminProjects);
    }

    // Cleanup
    await prisma.project.delete({ where: { id: project.id } });
}

verify()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
