import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiTutorService } from './ai-tutor.service';
import { ChatMessageDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('AI Tarihshy (AI Historical Tutor)')
@Controller('ai-tutor')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiTutorController {
  constructor(private readonly aiTutorService: AiTutorService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chat with AI Tarihshy (Historical Knowledge Assistant)' })
  askQuestion(@Body() dto: ChatMessageDto, @CurrentUser() user: any) {
    return this.aiTutorService.askAiTarihshy(dto, user);
  }
}
