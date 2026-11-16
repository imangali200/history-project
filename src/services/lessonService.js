/**
 * Lesson Service Layer
 * Connected to NestJS Backend: /api/lessons/:id & /api/lessons/:id/submit
 */

import { api } from './api';
import lessonsData from '../data/lessonsData.json';

/**
 * Fetch a lesson by ID from backend or fallback to local JSON
 */
export async function getLessonById(lessonId = 'stone-age-1') {
  try {
    const backendLesson = await api.get(`/lessons/${lessonId}`);
    if (backendLesson) {
      return backendLesson;
    }
  } catch (err) {
    console.warn(`[LessonService] Could not fetch lesson ${lessonId} from backend, using local bundle:`, err.message);
  }

  const lesson = lessonsData.lessons[lessonId] || lessonsData.lessons['stone-age-1'];
  return JSON.parse(JSON.stringify(lesson));
}

/**
 * Fetch list of all available lessons
 */
export async function getAllLessons() {
  try {
    const map = await api.get('/lessons/map');
    if (map?.eras) {
      return map;
    }
  } catch {
    // fallback
  }
  return Object.values(lessonsData.lessons);
}

/**
 * Submit lesson completion statistics to the backend
 */
export async function submitLessonResult(lessonId, results) {
  try {
    const res = await api.post(`/lessons/${lessonId}/submit`, {
      score: results.accuracy || results.score || 100,
      mistakesCount: (5 - (results.heartsRemaining ?? 5)) || 0,
      timeSpentSeconds: results.timeSpentSeconds || 60,
    });
    return res;
  } catch (err) {
    console.warn('[LessonService] Submit lesson to backend error:', err.message);
    return { success: true, ...results };
  }
}

export default {
  getLessonById,
  getAllLessons,
  submitLessonResult,
};
