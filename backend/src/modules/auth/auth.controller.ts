import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SduLoginDto, LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sdu-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SDU University Student Login via Student ID' })
  @ApiResponse({ status: 200, description: 'Student authenticated successfully' })
  async sduLogin(@Body() dto: SduLoginDto) {
    return this.authService.sduLogin(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Standard Login with Email or Student ID' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register New Student' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Current Authenticated Student Profile' })
  async getMe(@CurrentUser() user: any) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
