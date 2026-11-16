import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

import { PrismaModule } from './database/prisma/prisma.module';
import { MockDbModule } from './database/mock-db.module';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { GamesModule } from './modules/games/games.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { AiTutorModule } from './modules/ai-tutor/ai-tutor.module';
import { QuestsModule } from './modules/quests/quests.module';
import { CertificatesModule } from './modules/certificates/certificates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120,
      },
    ]),
    ScheduleModule.forRoot(),
    PrismaModule,
    MockDbModule,
    AuthModule,
    UsersModule,
    LessonsModule,
    GamesModule,
    LeaderboardModule,
    AiTutorModule,
    QuestsModule,
    CertificatesModule,
  ],
})
export class AppModule {}
