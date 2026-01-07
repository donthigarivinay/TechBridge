"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProjectPayment(projectId, amount, clientId) {
        return this.prisma.project.update({
            where: { id: projectId },
            data: {
                status: 'OPEN',
            },
        });
    }
    async distributeSalaries(projectId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                roles: {
                    include: {
                        teamMember: {
                            include: { student: true }
                        }
                    }
                }
            }
        });
        if (!project)
            throw new Error('Project not found');
        const distributions = project.roles.map(role => {
            if (role.teamMember) {
                const salary = project.budget * (role.salarySplit / 100);
                return {
                    studentId: role.teamMember.studentId,
                    amount: salary,
                    role: role.name
                };
            }
            return null;
        }).filter(Boolean);
        return distributions;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map