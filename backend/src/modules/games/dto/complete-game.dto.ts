import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CompleteGameDto {
  @ApiProperty({ example: 'time-travel', description: 'Game destination key (1-10)' })
  @IsNotEmpty()
  @IsString()
  gameKey: string;

  @ApiProperty({ example: 100, description: 'Score achieved in the game' })
  @IsNumber()
  score: number;

  @ApiProperty({ example: 3, description: 'Stars earned (1-3)' })
  @IsNumber()
  stars: number;

  @ApiProperty({ example: 1, description: 'Time crystal fragment ID (1-10)' })
  @IsOptional()
  @IsNumber()
  fragmentId?: number;

  @ApiProperty({ example: 'golden-headdress', description: 'Artifact key discovered' })
  @IsOptional()
  @IsString()
  artifactKey?: string;
}
