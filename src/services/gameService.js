/**
 * Game Service for History World
 * Connects to NestJS Backend: /api/games/world-state & /api/games/complete
 */

import { api } from './api';

export async function fetchWorldState() {
  try {
    const data = await api.get('/games/world-state');
    return data;
  } catch (err) {
    console.warn('[GameService] Could not fetch world state from backend, using local defaults:', err.message);
    return null;
  }
}

export async function completeHistoricalGame({ gameKey, score = 100, stars = 3, fragmentId, artifactKey }) {
  try {
    const result = await api.post('/games/complete', {
      gameKey,
      score,
      stars,
      fragmentId,
      artifactKey,
    });
    return result;
  } catch (err) {
    console.warn('[GameService] Complete game backend call failed:', err.message);
    return {
      success: true,
      xpEarned: stars * 25,
      coinsEarned: stars * 15,
      newFragmentAwarded: Boolean(fragmentId),
      fragmentId,
    };
  }
}

export default {
  fetchWorldState,
  completeHistoricalGame,
};
