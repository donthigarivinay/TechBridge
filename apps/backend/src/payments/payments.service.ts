import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectStatus, PaymentStatus, PaymentType } from '@btech/types';

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
                type: PaymentType.PROJECT_BUDGET,
                status: PaymentStatus.COMPLETED, // Simulating instant success
            },
        });

        // 2. Update Project Status
        return this.prisma.project.update({
            where: { id: projectId },
            data: {
                status: ProjectStatus.OPEN, // Mark as open for team formation after payment
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
                // Ensure salarySplit is treated as a percentage
                const salary = Math.round((project.budget * (role.salarySplit / 100)) * 100) / 100;

                // Create Payment record for student
                const payment = await this.prisma.payment.create({
                    data: {
                        amount: salary,
                        projectId: projectId,
                        toUserId: role.teamMember.student.userId,
                        type: PaymentType.SALARY_DISTRIBUTION,
                        status: PaymentStatus.PENDING,
                    }
                });

                distributions.push({
                    id: payment.id,
                    studentName: role.teamMember.student.user?.name || 'Unknown',
                    studentEmail: role.teamMember.student.user?.email,
                    amount: salary,
                    roleName: role.name,
                    status: payment.status
                });
            }
        }

        return distributions;
    }

    async confirmPayment(paymentId: string, referenceId: string) {
        return this.prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: PaymentStatus.COMPLETED,
                referenceId: referenceId
            }
        });
    }

    async getProjectDistributions(projectId: string) {
        return this.prisma.payment.findMany({
            where: {
                projectId,
                type: PaymentType.SALARY_DISTRIBUTION
            },
            include: {
                toUser: {
                    select: { name: true, email: true }
                }
            }
        });
    }
}
