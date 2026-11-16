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
      xp: student.xp || 450,
      level: student.level || 5,
      streak: student.streak || 4,
      hearts: student.hearts || 5,
      coins: student.coins || 350,
      timeCrystalFragments: student.timeCrystalFragments?.length || 4,
      totalFragmentsNeeded: 10,
      radarStats: {
        ancientHistory: 85,
        turkicKhaganates: 70,
        goldenHorde: 90,
        kazakhKhanate: 95,
        modernKazakhstan: 60,
      },
      weeklyActivity: [
        { day: 'Дүй', xp: 40 },
        { day: 'Сей', xp: 65 },
        { day: 'Сәр', xp: 50 },
        { day: 'Бей', xp: 80 },
        { day: 'Жұм', xp: 95 },
        { day: 'Сен', xp: 70 },
        { day: 'Жек', xp: (student.xp || 450) % 100 },
      ],
    };
  }
}
