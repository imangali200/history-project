import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatMessageDto {
  @ApiProperty({
    example: 'Қазақ хандығының негізін кімдер және қай жылы қалады?',
    description: 'User inquiry about Kazakh history or UNT preparation',
  })
  @IsNotEmpty({ message: 'Сұрақ мәтіні бос болмауы керек' })
  @IsString()
  message: string;
}
