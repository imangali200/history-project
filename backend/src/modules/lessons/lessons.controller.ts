import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { SubmitLessonDto } from './dto/submit-lesson.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Curriculum & Lessons')
@Controller('lessons')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get('map')
  @ApiOperation({ summary: 'Get Duolingo-style Historical Learning Path & Eras' })
  getCurriculumMap(@CurrentUser() user: any) {
    return this.lessonsService.getCurriculumMap(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Full Lesson Details & Interactive Questions' })
  getLessonById(@Param('id') id: string) {
    return this.lessonsService.getLessonById(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit Lesson Answers & Claim XP, Coins, Stars' })
  submitLesson(
    @Param('id') id: string,
    @Body() dto: SubmitLessonDto,
    @CurrentUser() user: any,
  ) {
    return this.lessonsService.submitLessonResult(id, dto, user);
  }
}
