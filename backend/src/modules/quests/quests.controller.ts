import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuestsService } from './quests.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Daily Quests & Streaks')
@Controller('quests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Get Active Daily Quests' })
  getDailyQuests(@CurrentUser() user: any) {
    return this.questsService.getDailyQuests(user);
  }

  @Post(':id/claim')
  @ApiOperation({ summary: 'Claim Daily Quest XP & Coin Rewards' })
  claimQuest(@Param('id') id: string, @CurrentUser() user: any) {
    return this.questsService.claimQuest(id, user);
  }
}
