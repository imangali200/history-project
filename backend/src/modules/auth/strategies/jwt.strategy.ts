import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { MockDbService } from '../../../database/mock-db.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private mockDb: MockDbService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_ACCESS_SECRET') ||
        'qazhistory_steppe_access_secret_super_secure_key_2026',
    });
  }

  async validate(payload: { sub: string; studentId?: string; role: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (user) return user;
    } catch {}

    const mockUser = this.mockDb.users.find((u) => u.id === payload.sub);
    if (!mockUser) {
      throw new UnauthorizedException('Пайдаланушы табылмады немесе сессия аяқталды');
    }
    return mockUser;
  }
}
