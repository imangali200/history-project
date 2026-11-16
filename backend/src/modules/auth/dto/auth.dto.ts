import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SduLoginDto {
  @ApiProperty({ example: '220107045', description: 'SDU University 9-digit Student ID' })
  @IsNotEmpty({ message: 'Студенттік ID енгізу қажет' })
  @IsString()
  studentId: string;

  @ApiProperty({ example: 'password123', description: 'SDU Portal Password' })
  @IsNotEmpty({ message: 'Құпия сөзді енгізіңіз' })
  @IsString()
  @MinLength(6, { message: 'Құпия сөз кемінде 6 таңбадан тұруы тиіс' })
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: '220107045@stu.sdu.edu.kz', description: 'Student Email or SDU ID' })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: '240105001' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ example: 'Ербол Азаматов' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Инженерия және жаратылыстану ғылымдары факультеті (FEAS)' })
  faculty?: string;

  @ApiProperty({ example: 1 })
  course?: number;
}
