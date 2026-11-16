/**
 * Leaderboard Service Layer
 * Connected to NestJS Backend: /api/leaderboard/weekly & /api/leaderboard/my-rank
 */

import { api } from './api';

export async function fetchWeeklyLeaderboard(faculty = 'all') {
  try {
    const data = await api.get(`/leaderboard/weekly?faculty=${faculty}`);
    return data;
  } catch (err) {
    console.warn('[LeaderboardService] Fetch leaderboard from backend failed:', err.message);
    return null;
  }
}

export async function fetchMyRank() {
  try {
    const data = await api.get('/leaderboard/my-rank');
    return data;
  } catch {
    return null;
  }
}

export default {
  fetchWeeklyLeaderboard,
  fetchMyRank,
};
