import { Injectable, NotFoundException } from '@nestjs/common';
import { MockDbService, MockUser } from '../../database/mock-db.service';
import { SubmitLessonDto } from './dto/submit-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private mockDb: MockDbService) {}

  getCurriculumMap(user?: MockUser) {
    return {
      eras: this.mockDb.eras,
      userProgress: {
        completedLessons: ['stone-age-1'],
        currentLessonId: 'stone-age-2',
        unlockedEras: ['stone-age', 'turkic-khaganate'],
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

  submitLessonResult(lessonId: string, dto: SubmitLessonDto, user: MockUser) {
    const lesson = this.getLessonById(lessonId);

    // Calculate stars
    let stars = 1;
    if (dto.score >= 90) stars = 3;
    else if (dto.score >= 70) stars = 2;

    const xpEarned = Math.round((lesson.xpReward || 25) * (dto.score / 100));
    const coinsEarned = stars * 10;

    // Update user stats in DB
    const dbUser = this.mockDb.users.find((u) => u.id === user.id);
    if (dbUser) {
      dbUser.xp += xpEarned;
      dbUser.coins += coinsEarned;
      dbUser.level = Math.floor(dbUser.xp / 100) + 1;

      // Handle hearts deduction on severe mistakes
      if (dto.mistakesCount > 2) {
        dbUser.hearts = Math.max(1, dbUser.hearts - 1);
      }

      // Check daily streak
      const today = new Date().toISOString().split('T')[0];
      if (dbUser.lastActiveDate !== today) {
        dbUser.streak += 1;
        dbUser.lastActiveDate = today;
      }
    }

    return {
      success: true,
      lessonId,
      stars,
      score: dto.score,
      xpEarned,
      coinsEarned,
      userCurrentXp: dbUser ? dbUser.xp : user.xp + xpEarned,
      userCurrentLevel: dbUser ? dbUser.level : user.level,
      userHearts: dbUser ? dbUser.hearts : user.hearts,
      streak: dbUser ? dbUser.streak : user.streak,
      message:
        stars === 3
          ? 'Керемет нәтиже! Барлық сұрақтарға мінсіз жауап бердіңіз!'
          : 'Жарайсың! Сабақ сәтті аяқталды!',
    };
  }
}
