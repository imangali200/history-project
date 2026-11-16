import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GamesService } from './games.service';
import { CompleteGameDto } from './dto/complete-game.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('History World Games (10 Modes)')
@Controller('games')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('world-state')
  @ApiOperation({ summary: 'Get History World Progress: Time Crystal & Artifacts' })
  getWorldState(@CurrentUser() user: any) {
    return this.gamesService.getWorldState(user);
  }

  @Post('complete')
  @ApiOperation({ summary: 'Complete Historical Game & Claim Fragment/Artifact/XP' })
  completeGame(@Body() dto: CompleteGameDto, @CurrentUser() user: any) {
    return this.gamesService.completeGame(dto, user);
  }
}
