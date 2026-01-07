import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService) { }

    async createProjectPayment(projectId: string, amount: number, userId: string) {
        // In a real app, this would integrate with Stripe/Razorpay
        // For now, we simulate the ledger entry

        // 1. Create Payment Record
        await this.prisma.payment.create({
            data: {
                amount,
                projectId,
                fromUserId: userId,
                type: 'PROJECT_BUDGET',
                status: 'COMPLETED', // Simulating instant success
            },
        });

        // 2. Update Project Status
        return this.prisma.project.update({
            where: { id: projectId },
            data: {
                status: 'OPEN', // Mark as open for team formation after payment
            },
        });
    }

    async distributeSalaries(projectId: string) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                roles: {
                    include: {
                        teamMember: {
                            include: {
                                student: {
                                    include: { user: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!project) throw new Error('Project not found');

        const distributions = [];

        for (const role of project.roles) {
            if (role.teamMember && role.teamMember.student) {
                const salary = project.budget * (role.salarySplit / 100);

                // Create Payment record for student
                const payment = await this.prisma.payment.create({
                    data: {
                        amount: salary,
                        projectId: projectId,
                        toUserId: role.teamMember.student.userId,
                        type: 'SALARY_DISTRIBUTION',
                        status: 'PENDING', // Pending until admin confirmation or batch process
                    }
                });

                distributions.push({
                    studentName: role.teamMember.student.user?.name || 'Unknown', // access user relation if included?
                    amount: salary,
                    role: role.name,
                    paymentId: payment.id
                });
            }
        }

        return distributions;
    }
}
