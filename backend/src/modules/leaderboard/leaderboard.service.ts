import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { MockDbService, MockUser } from '../../database/mock-db.service';

@Injectable()
export class LeaderboardService {
  constructor(
    private prisma: PrismaService,
    private mockDb: MockDbService,
  ) {}

  async getWeeklyLeaderboard(facultyFilter?: string) {
    try {
      const whereClause: any = {};
      if (facultyFilter && facultyFilter !== 'all') {
        whereClause.faculty = { contains: facultyFilter, mode: 'insensitive' };
      }

      const dbUsers = await this.prisma.user.findMany({
        where: whereClause,
        orderBy: { xp: 'desc' },
        take: 50,
      });

      if (dbUsers && dbUsers.length > 0) {
        return dbUsers.map((u, index) => ({
          rank: index + 1,
          id: u.id,
          name: u.name,
          nameEn: u.nameEn || u.name,
          studentId: u.studentId,
          avatar: u.avatar || '🦁',
          faculty: u.faculty || 'SDU',
          xp: u.xp,
          streak: u.streak,
          level: u.level,
          league: u.xp > 400 ? 'EMERALD' : u.xp > 200 ? 'GOLD' : 'SILVER',
          isTop3: index < 3,
        }));
      }
    } catch (e) {
      // Fall back to in-memory mock users if DB connection fails
    }

    let list = [...this.mockDb.users];

    if (facultyFilter && facultyFilter !== 'all') {
      list = list.filter((u) => u.faculty?.includes(facultyFilter));
    }

    // Sort by XP descending
    list.sort((a, b) => b.xp - a.xp);

    return list.map((u, index) => ({
      rank: index + 1,
      id: u.id,
      name: u.name,
      nameEn: (u as any).nameEn || u.name,
      studentId: u.studentId,
      avatar: u.avatar,
      faculty: u.faculty,
      xp: u.xp,
      streak: u.streak,
      level: u.level,
      league: u.xp > 400 ? 'EMERALD' : u.xp > 200 ? 'GOLD' : 'SILVER',
      isTop3: index < 3,
    }));
  }

  async getMyRank(user: any) {
    try {
      const dbUsers = await this.prisma.user.findMany({
        orderBy: { xp: 'desc' },
        select: { id: true, studentId: true, xp: true },
      });

      if (dbUsers && dbUsers.length > 0) {
        const index = dbUsers.findIndex((u) => u.id === user?.id || u.studentId === user?.studentId);
        const currentUserXp = user?.xp ?? (index >= 0 ? dbUsers[index].xp : 0);
        return {
          rank: index >= 0 ? index + 1 : dbUsers.length + 1,
          totalParticipants: dbUsers.length,
          userXp: currentUserXp,
          league: currentUserXp > 400 ? 'EMERALD' : currentUserXp > 200 ? 'GOLD' : 'SILVER',
        };
      }
    } catch (e) {}

    const list = [...this.mockDb.users].sort((a, b) => b.xp - a.xp);
    const index = list.findIndex((u) => u.id === user?.id || u.studentId === user?.studentId);
    return {
      rank: index >= 0 ? index + 1 : 1,
      totalParticipants: Math.max(list.length, 1),
      userXp: user?.xp ?? 0,
      league: (user?.xp ?? 0) > 400 ? 'EMERALD' : (user?.xp ?? 0) > 200 ? 'GOLD' : 'SILVER',
    };
  }
}
