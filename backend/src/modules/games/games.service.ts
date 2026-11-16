import { Injectable, BadRequestException } from '@nestjs/common';
import { MockDbService, MockUser } from '../../database/mock-db.service';
import { CompleteGameDto } from './dto/complete-game.dto';

@Injectable()
export class GamesService {
  constructor(private mockDb: MockDbService) {}

  getWorldState(user: MockUser) {
    const dbUser = this.mockDb.users.find((u) => u.id === user.id) || user;

    return {
      destinations: this.mockDb.gameDestinations,
      timeCrystalFragments: dbUser.timeCrystalFragments || [],
      crystalRestored: (dbUser.timeCrystalFragments || []).length >= 10,
      artifacts: this.mockDb.artifacts.map((a) => ({
        ...a,
        unlocked: dbUser.unlockedArtifacts?.includes(a.key) || false,
      })),
      userCoins: dbUser.coins,
      userXp: dbUser.xp,
    };
  }

  completeGame(dto: CompleteGameDto, user: MockUser) {
    const dbUser = this.mockDb.users.find((u) => u.id === user.id);
    if (!dbUser) {
      throw new BadRequestException('Пайдаланушы табылмады');
    }

    const xpEarned = dto.stars * 25 + Math.round(dto.score / 4);
    const coinsEarned = dto.stars * 15;

    dbUser.xp += xpEarned;
    dbUser.coins += coinsEarned;
    dbUser.level = Math.floor(dbUser.xp / 100) + 1;

    // Award Time Crystal Fragment (1..10)
    let newFragmentAwarded = false;
    if (dto.fragmentId && !dbUser.timeCrystalFragments.includes(dto.fragmentId)) {
      dbUser.timeCrystalFragments.push(dto.fragmentId);
      dbUser.timeCrystalFragments.sort((a, b) => a - b);
      newFragmentAwarded = true;
    }

    // Award Artifact if discovered
    let newArtifactAwarded = false;
    if (dto.artifactKey && !dbUser.unlockedArtifacts.includes(dto.artifactKey)) {
      dbUser.unlockedArtifacts.push(dto.artifactKey);
      newArtifactAwarded = true;
    }

    return {
      success: true,
      gameKey: dto.gameKey,
      xpEarned,
      coinsEarned,
      stars: dto.stars,
      newFragmentAwarded,
      fragmentId: dto.fragmentId,
      newArtifactAwarded,
      artifactKey: dto.artifactKey,
      totalFragmentsCollected: dbUser.timeCrystalFragments.length,
      timeCrystalFragments: dbUser.timeCrystalFragments,
      message: newFragmentAwarded
        ? `Құттықтаймыз! Сіз Уақыт Кристалының ${dto.fragmentId}-ші сынығын қалпына келтірдіңіз!`
        : 'Тамаша жеңіс! Сыйлықтарыңыз есептелді!',
    };
  }
}
