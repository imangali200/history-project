import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class SubmitLessonDto {
  @ApiProperty({ example: 85, description: 'Percentage score 0..100' })
  @IsNumber()
  score: number;

  @ApiProperty({ example: 0, description: 'Number of mistakes made' })
  @IsNumber()
  mistakesCount: number;

  @ApiProperty({ example: 120, description: 'Seconds spent on the lesson' })
  @IsOptional()
  @IsNumber()
  timeSpentSeconds?: number;

  @ApiProperty({ example: [{ questionId: 'q1', selectedAnswer: 'Ботай мәдениеті' }] })
  @IsOptional()
  @IsArray()
  answers?: any[];
}
