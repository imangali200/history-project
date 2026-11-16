import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('SDU Certificates & Verification')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('generate')
  @ApiOperation({ summary: 'Generate SDU Course Mastery Certificate' })
  generate(@CurrentUser() user: any) {
    return this.certificatesService.generateCertificate(user);
  }

  @Public()
  @Get('verify/:code')
  @ApiOperation({ summary: 'Public Endpoint to Verify SDU Certificate by Code' })
  verify(@Param('code') code: string) {
    return this.certificatesService.verifyCertificate(code);
  }
}
