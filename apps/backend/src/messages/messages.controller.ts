import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
    constructor(private messagesService: MessagesService) { }

    @Get('conversations')
    @ApiOperation({ summary: 'Get list of conversations' })
    async getConversations(@Request() req: any) {
        return this.messagesService.getUserConversations(req.user.userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get conversation details and messages' })
    async getConversation(@Request() req: any, @Param('id') id: string) {
        return this.messagesService.getConversation(id, req.user.userId);
    }

    @Post()
    @ApiOperation({ summary: 'Send a message' })
    async sendMessage(@Request() req: any, @Body() data: { conversationId: string, content: string }) {
        return this.messagesService.sendMessage(req.user.userId, data.conversationId, data.content);
    }

    @Post('start')
    @ApiOperation({ summary: 'Start a conversation with a user' })
    async startConversation(@Request() req: any, @Body() data: { targetUserId: string }) {
        return this.messagesService.startConversation(req.user.userId, data.targetUserId);
    }

    @Post('contact-admin')
    @ApiOperation({ summary: 'Start a support chat with an admin' })
    async contactAdmin(@Request() req: any) {
        return this.messagesService.contactAdmin(req.user.userId);
    }
}
