import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }

    async register(data: any) {
        console.log('Register called for:', data.email, 'as', data.role);
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);

            const user = await this.prisma.$transaction(async (prisma) => {
                // Check if user already exists
                const existing = await prisma.user.findUnique({ where: { email: data.email } });
                if (existing) {
                    throw new ConflictException('User with this email already exists');
                }

                const newUser = await prisma.user.create({
                    data: {
                        name: data.name,
                        email: data.email,
                        password: hashedPassword,
                        role: data.role || 'STUDENT',
                    },
                });

                if (newUser.role === 'STUDENT') {
                    await prisma.studentProfile.create({ data: { userId: newUser.id } });
                } else if (newUser.role === 'CLIENT') {
                    await prisma.clientProfile.create({ data: { userId: newUser.id } });
                } else if (newUser.role === 'ADMIN') {
                    await prisma.adminProfile.create({ data: { userId: newUser.id } });
                }

                return newUser;
            });

            return this.login(user);
        } catch (error: any) {
            console.error('Registration failed:', error.message);
            if (error instanceof ConflictException) throw error;
            throw new InternalServerErrorException('Registration failed. Please try again.');
        }
    }

    async logout(userId: string) {
        return { message: 'Logged out successfully' };
    }

    async refreshToken(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async verifyEmail(token: string) {
        return { message: 'Email verified successfully' };
    }

    async forgotPassword(email: string) {
        return { message: 'If email exists, reset link sent' };
    }

    async resetPassword(token: string, newPass: string) {
        return { message: 'Password reset successfully' };
    }
}
