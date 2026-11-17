import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { MockDbService } from '../../database/mock-db.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mockDb: MockDbService,
  ) {}

  async getProfile(user: any) {
    let dbUser: any = null;
    try {
      dbUser = await this.prisma.user.findUnique({ where: { id: user.id } });
    } catch {}

    const profile = dbUser || this.mockDb.users.find((u) => u.id === user.id) || user;
    const { passwordHash, ...safeUser } = profile;
    return safeUser;
  }

  async updateProfile(user: any, updates: any) {
    try {
      const updated = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          ...(updates.name ? { name: updates.name } : {}),
          ...(updates.avatar ? { avatar: updates.avatar } : {}),
        },
      });
      const { passwordHash, ...safeUser } = updated as any;
      return safeUser;
    } catch {
      let mockUser = this.mockDb.users.find((u) => u.id === user.id);
      if (!mockUser) {
        mockUser = { ...user };
        this.mockDb.users.push(mockUser);
      }
      if (updates.name) mockUser.name = updates.name;
      if (updates.avatar) mockUser.avatar = updates.avatar;
      const { passwordHash, ...safeUser } = mockUser as any;
      return safeUser;
    }
  }

  async getUserStats(user: any) {
    let dbUser: any = null;
    try {
      dbUser = await this.prisma.user.findUnique({ where: { id: user.id } });
    } catch {}

    const student = dbUser || user;

    return {
      xp: student.xp ?? 0,
      level: student.level ?? 1,
      streak: student.streak ?? 0,
      hearts: student.hearts ?? 5,
      coins: student.coins ?? 100,
      timeCrystalFragments: student.timeCrystalFragments?.length || 0,
      totalFragmentsNeeded: 10,
      radarStats: {
        ancientHistory: Math.min(100, (student.xp ?? 0) * 2),
        turkicKhaganates: Math.min(100, Math.floor((student.xp ?? 0) * 1.5)),
        goldenHorde: Math.min(100, (student.xp ?? 0)),
        kazakhKhanate: Math.min(100, Math.floor((student.xp ?? 0) * 1.8)),
        modernKazakhstan: Math.min(100, Math.floor((student.xp ?? 0) * 1.2)),
      },
      weeklyActivity: [
        { day: 'Дүй', xp: Math.round((student.xp ?? 0) * 0.1) },
        { day: 'Сей', xp: Math.round((student.xp ?? 0) * 0.15) },
        { day: 'Сәр', xp: Math.round((student.xp ?? 0) * 0.2) },
        { day: 'Бей', xp: Math.round((student.xp ?? 0) * 0.1) },
        { day: 'Жұм', xp: Math.round((student.xp ?? 0) * 0.25) },
        { day: 'Сен', xp: Math.round((student.xp ?? 0) * 0.1) },
        { day: 'Жек', xp: Math.round((student.xp ?? 0) * 0.1) },
      ],
    };
  }
}
