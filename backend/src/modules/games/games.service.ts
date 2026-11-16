import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { MockDbService } from '../../database/mock-db.service';
import { CompleteGameDto } from './dto/complete-game.dto';

@Injectable()
export class GamesService {
  constructor(
    private prisma: PrismaService,
    private mockDb: MockDbService,
  ) {}

  async getWorldState(user: any) {
    let dbUser: any = null;
    try {
      dbUser = await this.prisma.user.findUnique({ where: { id: user.id } });
    } catch {}

    const fragments = dbUser?.timeCrystalFragments || user.timeCrystalFragments || [1, 2, 3, 5];

    return {
      destinations: this.mockDb.gameDestinations,
      timeCrystalFragments: fragments,
      crystalRestored: fragments.length >= 10,
      artifacts: this.mockDb.artifacts.map((a, idx) => ({
        ...a,
        unlocked: fragments.includes(idx + 1) || false,
      })),
      userCoins: dbUser?.coins ?? user.coins ?? 350,
      userXp: dbUser?.xp ?? user.xp ?? 450,
    };
  }

  async completeGame(dto: CompleteGameDto, user: any) {
    const xpEarned = dto.stars * 25 + Math.round(dto.score / 4);
    const coinsEarned = dto.stars * 15;

    let updatedFragments: number[] = [];
    let newFragmentAwarded = false;

    try {
      const dbUser = await this.prisma.user.findUnique({ where: { id: user.id } });
      if (dbUser) {
        const currentFragments = [...(dbUser.timeCrystalFragments || [])];
        if (dto.fragmentId && !currentFragments.includes(dto.fragmentId)) {
          currentFragments.push(dto.fragmentId);
          currentFragments.sort((a, b) => a - b);
          newFragmentAwarded = true;
        }
        updatedFragments = currentFragments;

        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            xp: dbUser.xp + xpEarned,
            coins: dbUser.coins + coinsEarned,
            level: Math.floor((dbUser.xp + xpEarned) / 100) + 1,
            timeCrystalFragments: currentFragments,
          },
        });
      }
    } catch (e) {
      // Mock fallback
      let mockUser = this.mockDb.users.find((u) => u.id === user.id);
      if (mockUser) {
        mockUser.xp += xpEarned;
        mockUser.coins += coinsEarned;
        if (dto.fragmentId && !mockUser.timeCrystalFragments.includes(dto.fragmentId)) {
          mockUser.timeCrystalFragments.push(dto.fragmentId);
          newFragmentAwarded = true;
        }
        updatedFragments = mockUser.timeCrystalFragments;
      }
    }

    return {
      success: true,
      gameKey: dto.gameKey,
      xpEarned,
      coinsEarned,
      stars: dto.stars,
      newFragmentAwarded,
      fragmentId: dto.fragmentId,
      timeCrystalFragments: updatedFragments,
      message: 'Тамаша жеңіс! Сыйлықтарыңыз есептелді!',
    };
  }
}
