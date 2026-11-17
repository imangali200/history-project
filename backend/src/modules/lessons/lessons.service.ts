import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { MockDbService, MockUser } from '../../database/mock-db.service';
import { SubmitLessonDto } from './dto/submit-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    private mockDb: MockDbService,
  ) {}

  async getCurriculumMap(user?: any) {
    let completedLessons: string[] = [];
    try {
      if (user?.id) {
        const progresses = await this.prisma.userLessonProgress.findMany({
          where: { userId: user.id, status: 'COMPLETED' },
          include: { lesson: true },
        });
        if (progresses?.length > 0) {
          completedLessons = progresses.map((p) => p.lesson.slug);
        }
      }
    } catch {}

    return {
      eras: this.mockDb.eras,
      userProgress: {
        completedLessons,
        currentLessonId: completedLessons.length > 0 ? 'saka-1' : 'stone-age-1',
        unlockedEras: ['stone-age', 'saka-era', 'turkic-khaganate'],
      },
    };
  }

  getLessonById(lessonId: string) {
    const lesson = this.mockDb.lessons.find(
      (l) => l.id === lessonId || l.slug === lessonId,
    );
    if (!lesson) {
      throw new NotFoundException(`Сабақ табылмады: ${lessonId}`);
    }
    return lesson;
  }

  async submitLessonResult(lessonId: string, dto: SubmitLessonDto, user: any) {
    const lesson = this.getLessonById(lessonId);

    // Calculate stars
    let stars = 1;
    if (dto.score >= 90) stars = 3;
    else if (dto.score >= 70) stars = 2;

    const xpEarned = Math.round((lesson.xpReward || 25) * (dto.score / 100));
    const coinsEarned = stars * 10;

    let userCurrentXp = (user?.xp ?? 0) + xpEarned;
    let userCurrentLevel = Math.floor(userCurrentXp / 100) + 1;
    let userHearts = user?.hearts ?? 5;
    let streak = user?.streak ?? 1;

    // 1. Try to update Prisma in Supabase
    try {
      if (user?.id) {
        const dbUser = await this.prisma.user.findUnique({ where: { id: user.id } });
        if (dbUser) {
          const newXp = dbUser.xp + xpEarned;
          const newCoins = dbUser.coins + coinsEarned;
          const newLevel = Math.floor(newXp / 100) + 1;
          const newHearts = dto.mistakesCount > 2 ? Math.max(1, dbUser.hearts - 1) : dbUser.hearts;
          const newStreak = Math.max(1, dbUser.streak + 1);

          await this.prisma.user.update({
            where: { id: user.id },
            data: {
              xp: newXp,
              coins: newCoins,
              level: newLevel,
              hearts: newHearts,
              streak: newStreak,
            },
          });

          userCurrentXp = newXp;
          userCurrentLevel = newLevel;
          userHearts = newHearts;
          streak = newStreak;
        }
      }
    } catch (e) {
      // 2. Mock fallback
      const dbUser = this.mockDb.users.find((u) => u.id === user?.id);
      if (dbUser) {
        dbUser.xp += xpEarned;
        dbUser.coins += coinsEarned;
        dbUser.level = Math.floor(dbUser.xp / 100) + 1;

        if (dto.mistakesCount > 2) {
          dbUser.hearts = Math.max(1, dbUser.hearts - 1);
        }

        const today = new Date().toISOString().split('T')[0];
        if (dbUser.lastActiveDate !== today) {
          dbUser.streak += 1;
          dbUser.lastActiveDate = today;
        }

        userCurrentXp = dbUser.xp;
        userCurrentLevel = dbUser.level;
        userHearts = dbUser.hearts;
        streak = dbUser.streak;
      }
    }

    return {
      success: true,
      lessonId,
      stars,
      score: dto.score,
      xpEarned,
      coinsEarned,
      userCurrentXp,
      userCurrentLevel,
      userHearts,
      streak,
      message:
        stars === 3
          ? 'Керемет нәтиже! Барлық сұрақтарға мінсіз жауап бердіңіз!'
          : 'Жарайсың! Сабақ сәтті аяқталды!',
    };
  }
}
