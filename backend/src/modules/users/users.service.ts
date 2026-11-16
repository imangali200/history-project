import { Injectable } from '@nestjs/common';
import { MockDbService, MockUser } from '../../database/mock-db.service';

@Injectable()
export class UsersService {
  constructor(private mockDb: MockDbService) {}

  getProfile(user: MockUser) {
    const dbUser = this.mockDb.users.find((u) => u.id === user.id) || user;
    const { passwordHash, ...safeUser } = dbUser;
    return safeUser;
  }

  updateProfile(user: MockUser, updates: Partial<MockUser>) {
    const dbUser = this.mockDb.users.find((u) => u.id === user.id);
    if (dbUser) {
      if (updates.name) dbUser.name = updates.name;
      if (updates.avatar) dbUser.avatar = updates.avatar;
    }
    const { passwordHash, ...safeUser } = (dbUser || user) as any;
    return safeUser;
  }

  getUserStats(user: MockUser) {
    const dbUser = this.mockDb.users.find((u) => u.id === user.id) || user;

    return {
      xp: dbUser.xp,
      level: dbUser.level,
      streak: dbUser.streak,
      hearts: dbUser.hearts,
      coins: dbUser.coins,
      timeCrystalFragments: dbUser.timeCrystalFragments?.length || 0,
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
        { day: 'Жек', xp: dbUser.xp % 100 },
      ],
    };
  }
}
