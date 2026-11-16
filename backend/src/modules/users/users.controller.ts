import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users & Profile')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get Detailed Student Profile' })
  getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update Student Profile (Avatar, Name)' })
  updateProfile(@CurrentUser() user: any, @Body() updates: any) {
    return this.usersService.updateProfile(user, updates);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get Student Learning Statistics & Radar Analysis' })
  getStats(@CurrentUser() user: any) {
    return this.usersService.getUserStats(user);
  }
}
