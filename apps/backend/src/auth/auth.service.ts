import { Injectable, UnauthorizedException } from '@nestjs/common';
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
        console.log('Register called with:', data.email);
        try {
            console.log('Hashing password...');
            const hashedPassword = await bcrypt.hash(data.password, 10);
            console.log('Password hashed. Starting transaction...');

            // Transaction to create user and profile if student
            const user = await this.prisma.$transaction(async (prisma) => {
                console.log('Creating user in DB...');
                const newUser = await prisma.user.create({
                    data: {
                        name: data.name,
                        email: data.email,
                        password: hashedPassword,
                        role: data.role || 'STUDENT',
                    },
                });
                console.log('User created:', newUser.id);

                if (newUser.role === 'STUDENT') {
                    console.log('Creating student profile...');
                    await prisma.studentProfile.create({
                        data: {
                            userId: newUser.id,
                        },
                    });
                }
                return newUser;
            });
            console.log('Transaction complete.');

            return this.login(user);
        } catch (error) {
            console.error('Error registering user:', (error as any).message, (error as any).stack);
            throw error;
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
