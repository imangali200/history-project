import { Injectable } from '@nestjs/common';
import { MockDbService, MockUser } from '../../database/mock-db.service';

@Injectable()
export class LeaderboardService {
  constructor(private mockDb: MockDbService) {}

  getWeeklyLeaderboard(facultyFilter?: string) {
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

  getMyRank(user: MockUser) {
    const list = [...this.mockDb.users].sort((a, b) => b.xp - a.xp);
    const index = list.findIndex((u) => u.id === user.id);
    return {
      rank: index >= 0 ? index + 1 : list.length + 1,
      totalParticipants: list.length,
      userXp: user.xp,
      league: user.xp > 400 ? 'EMERALD' : user.xp > 200 ? 'GOLD' : 'SILVER',
    };
  }
}
