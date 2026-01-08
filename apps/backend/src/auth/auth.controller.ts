import { Controller, Post, Body, UseGuards, Request, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() createUserDto: any) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    async login(@Body() loginDto: any) {
        try {
            console.log('Login attempt for:', loginDto.email);
            const user = await this.authService.validateUser(loginDto.email, loginDto.password);
            if (!user) {
                console.log('Invalid credentials for:', loginDto.email);
                throw new UnauthorizedException('Invalid credentials');
            }
            console.log('Login successful for:', loginDto.email);
            return this.authService.login(user);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @ApiOperation({ summary: 'Logout user' })
    async logout(@Request() req: any) {
        return this.authService.logout(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('refresh-token')
    @ApiOperation({ summary: 'Refresh access token' })
    async refreshToken(@Request() req: any) {
        return this.authService.refreshToken(req.user);
    }

    @Post('verify-email')
    @ApiOperation({ summary: 'Verify email address' })
    async verifyEmail(@Body('token') token: string) {
        return this.authService.verifyEmail(token);
    }

    @Post('forgot-password')
    @ApiOperation({ summary: 'Request password reset' })
    async forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Reset password' })
    async resetPassword(@Body() body: any) {
        return this.authService.resetPassword(body.token, body.password);
    }
}
