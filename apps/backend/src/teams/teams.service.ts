import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamsService {
    constructor(private prisma: PrismaService) { }

    async createTeam(projectId: string) {
        return this.prisma.team.create({
            data: { projectId },
        });
    }

    async addMember(teamId: string, studentId: string, roleId: string) {
        return this.prisma.teamMember.create({
            data: {
                teamId,
                studentId,
                roleId,
            },
        });
    }

    async getTeamByProject(projectId: string) {
        return this.prisma.team.findUnique({
            where: { projectId },
            include: {
                members: {
                    include: {
                        student: { include: { user: { select: { name: true, email: true } } } },
                        role: true,
                    },
                },
            },
        });
    }
    async addMemberByProject(projectId: string, studentId: string, roleId: string) {
        let team = await this.prisma.team.findUnique({ where: { projectId } });
        if (!team) {
            team = await this.createTeam(projectId);
        }
        // Check if already in team? Unique constraint on roleId might handle some, but student in multiple roles?
        // Schema: roleId @unique. So one person per role, one role per person?
        // TeamMember: roleId @unique.
        return this.addMember(team.id, studentId, roleId);
    }

    async removeMemberByProject(projectId: string, studentId: string) {
        const team = await this.prisma.team.findUnique({ where: { projectId } });
        if (!team) throw new Error('Team not found');

        const member = await this.prisma.teamMember.findFirst({
            where: { teamId: team.id, studentId }
        });

        if (!member) throw new Error('Member not found in team');

        return this.prisma.teamMember.delete({
            where: { id: member.id }
        });
    }
}
