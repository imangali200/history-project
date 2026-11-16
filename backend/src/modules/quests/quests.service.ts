import { Injectable, BadRequestException } from '@nestjs/common';
import { MockDbService, MockUser } from '../../database/mock-db.service';

@Injectable()
export class QuestsService {
  constructor(private mockDb: MockDbService) {}

  getDailyQuests(user: MockUser) {
    return this.mockDb.dailyQuests.map((q, idx) => ({
      ...q,
      progress: idx === 0 ? 1 : 0,
      completed: idx === 0,
      claimed: false,
    }));
  }

  claimQuest(questId: string, user: MockUser) {
    const quest = this.mockDb.dailyQuests.find((q) => q.id === questId);
    if (!quest) {
      throw new BadRequestException('Тапсырма табылмады');
    }

    const dbUser = this.mockDb.users.find((u) => u.id === user.id);
    if (dbUser) {
      dbUser.xp += quest.xpReward;
      dbUser.coins += quest.coinReward;
    }

    return {
      success: true,
      questId,
      xpAwarded: quest.xpReward,
      coinAwarded: quest.coinReward,
      message: 'Күнделікті тапсырма сыйлығы сәтті алынды!',
    };
  }
}
