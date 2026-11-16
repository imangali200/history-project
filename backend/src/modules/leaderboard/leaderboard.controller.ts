import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Leaderboard & Leagues')
@Controller('leaderboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('weekly')
  @ApiOperation({ summary: 'Get Weekly XP League Rankings' })
  @ApiQuery({ name: 'faculty', required: false, description: 'Filter by SDU faculty (FEAS, FEH, etc.)' })
  getWeekly(@Query('faculty') faculty?: string) {
    return this.leaderboardService.getWeeklyLeaderboard(faculty);
  }

  @Get('my-rank')
  @ApiOperation({ summary: 'Get Current Authenticated Student Rank' })
  getMyRank(@CurrentUser() user: any) {
    return this.leaderboardService.getMyRank(user);
  }
}
