import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import sounds from '../utils/audio';
import confetti from 'canvas-confetti';
import { fetchWorldState, completeHistoricalGame } from '../services/gameService';

// Lore & Data
import {
  DESTINATIONS,
  INITIAL_GAME_STATE,
  TIME_KEEPER_LORE
} from '../components/history_world/historyWorldData';

// Layout & Modals
import HistoryWorldHeader from '../components/history_world/HistoryWorldHeader';
import WorldMap from '../components/history_world/WorldMap';
import TimeKeeperModal from '../components/history_world/TimeKeeperModal';
import CrystalModal from '../components/history_world/CrystalModal';
import ArtifactMuseumModal from '../components/history_world/ArtifactMuseumModal';
import AvatarCustomizerModal from '../components/history_world/AvatarCustomizerModal';

// 10 Game Modes
import GameTimeTravel from '../components/history_world/games/GameTimeTravel';
import GameDetective from '../components/history_world/games/GameDetective';
import GameBattle from '../components/history_world/games/GameBattle';
import GameGuessHero from '../components/history_world/games/GameGuessHero';
import GameMapExplorer from '../components/history_world/games/GameMapExplorer';
import GameTimeline from '../components/history_world/games/GameTimeline';
import GameBecomeHero from '../components/history_world/games/GameBecomeHero';
import GameArchaeologist from '../components/history_world/games/GameArchaeologist';
import GameKingdomBuilder from '../components/history_world/games/GameKingdomBuilder';
import GameEscapeRoom from '../components/history_world/games/GameEscapeRoom';

const STORAGE_KEY = 'history_world_save_v1';

export default function GamesPage() {
  const { i18n } = useTranslation();
  const { addXp } = useAuth();
  const lang = i18n.language === 'en' ? 'en' : 'kk';

  // Game Persistence State
  const [gameState, setGameState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_GAME_STATE, ...parsed };
      }
    } catch {
      // fallback
    }
    return INITIAL_GAME_STATE;
  });

  // Active Game State (null = World Map)
  const [activeDestination, setActiveDestination] = useState(null);

  const handleSelectDestination = (dest) => {
    sounds.playTap?.();
    setActiveDestination(dest);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitGame = () => {
    sounds.playTap?.();
    setActiveDestination(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modals State
  const [isTimeKeeperOpen, setIsTimeKeeperOpen] = useState(false);
  const [isCrystalOpen, setIsCrystalOpen] = useState(false);
  const [isMuseumOpen, setIsMuseumOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch {
      // ignore
    }
  }, [gameState]);

  // Sync with NestJS backend on mount
  useEffect(() => {
    fetchWorldState().then((backendState) => {
      if (backendState?.timeCrystalFragments) {
        setGameState((prev) => ({
          ...prev,
          collectedFragments: Array.from(new Set([...prev.collectedFragments, ...backendState.timeCrystalFragments])),
          coins: backendState.userCoins ?? prev.coins,
          xp: backendState.userXp ?? prev.xp,
        }));
      }
    });
  }, []);

  // Handle Game Completion
  const handleGameComplete = (destId) => {
    const dest = DESTINATIONS.find(d => d.id === destId);
    if (!dest) {
      setActiveDestination(null);
      return;
    }

    // Award Rewards
    const hasFragment = gameState.collectedFragments?.includes(destId);
    const updatedFragments = hasFragment
      ? gameState.collectedFragments
      : [...(gameState.collectedFragments || []), destId];

    const hasArtifact = gameState.artifacts?.includes(destId);
    const updatedArtifacts = hasArtifact
      ? gameState.artifacts
      : [...(gameState.artifacts || []), destId];

    const earnedXp = dest.xpReward || 150;
    const earnedCoins = dest.coinReward || 80;

    // Sync with global auth XP
    if (addXp) {
      addXp(earnedXp);
    }

    // Report game completion to NestJS backend
    completeHistoricalGame({
      gameKey: dest.key || dest.id,
      score: 100,
      stars: 3,
      fragmentId: dest.id,
    });

    setGameState(prev => ({
      ...prev,
      collectedFragments: updatedFragments,
      artifacts: updatedArtifacts,
      coins: prev.coins + earnedCoins,
      xp: (prev.xp || 0) + earnedXp
    }));

    // Return to World Map
    setActiveDestination(null);
  };

  // Restore Time Crystal Ceremony
  const handleRestoreCrystal = () => {
    sounds.playFanfare();
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
    if (addXp) addXp(500);

    setGameState(prev => ({
      ...prev,
      xp: (prev.xp || 0) + 500,
      coins: prev.coins + 300,
      playerTitle: 'Мәңгілік Уақыт Әміршісі',
      playerTitleEn: 'Master of Eternity'
    }));

    setIsCrystalOpen(false);
  };

  // Avatar Selection
  const handleSelectAvatar = (av) => {
    setGameState(prev => ({
      ...prev,
      avatar: av.id,
      playerTitle: av.badge,
      playerTitleEn: av.nameEn
    }));
    setIsAvatarOpen(false);
  };

  return (
    <div className="min-h-screen pb-24 text-on-surface">
      <div className="max-w-6xl mx-auto px-4 pt-4 md:pt-6">
        {/* Top Header / HUD */}
        <HistoryWorldHeader
          gameState={gameState}
          onOpenCrystal={() => {
            sounds.playTap();
            setIsCrystalOpen(true);
          }}
          onOpenMuseum={() => {
            sounds.playTap();
            setIsMuseumOpen(true);
          }}
          onOpenAvatar={() => {
            sounds.playTap();
            setIsAvatarOpen(true);
          }}
          onOpenTimeKeeper={() => {
            sounds.playTap();
            setIsTimeKeeperOpen(true);
          }}
          lang={lang}
        />

        {/* Dynamic Game View or World Map */}
        {activeDestination ? (
          <div className="animate-fadeIn">
            {activeDestination.key === 'time-travel' && (
              <GameTimeTravel
                onComplete={handleGameComplete}
                onExit={handleExitGame}
                lang={lang}
              />
            )}
            {activeDestination.key === 'detective' && (
              <GameDetective
                onComplete={handleGameComplete}
                onExit={handleExitGame}
                lang={lang}
              />
            )}
            {activeDestination.key === 'battle' && (
              <GameBattle
                onComplete={handleGameComplete}
                onExit={handleExitGame}
                lang={lang}
              />
            )}
            {activeDestination.key === 'guess-hero' && (
              <GameGuessHero
                onComplete={handleGameComplete}
                onExit={handleExitGame}
                lang={lang}
              />
            )}
            {activeDestination.key === 'map-explorer' && (
              <GameMapExplorer
                onComplete={handleGameComplete}
                onExit={handleExitGame}
                lang={lang}
              />
            )}
            {activeDestination.key === 'timeline' && (
              <GameTimeline
                onComplete={handleGameComplete}
                onExit={handleExitGame}
                lang={lang}
              />
            )}
            {activeDestination.key === 'become-hero' && (
              <GameBecomeHero
                onComplete={handleGameComplete}
                onExit={handleExitGame}
                lang={lang}
              />
            )}
            {activeDestination.key === 'archaeologist' && (
              <GameArchaeologist
                onComplete={handleGameComplete}
                onExit={handleExitGame}
                lang={lang}
              />
            )}
            {activeDestination.key === 'kingdom-builder' && (
              <GameKingdomBuilder
                onComplete={handleGameComplete}
                onExit={handleExitGame}
                lang={lang}
              />
            )}
            {activeDestination.key === 'escape-room' && (
              <GameEscapeRoom
                onComplete={handleGameComplete}
                onExit={handleExitGame}
                lang={lang}
              />
            )}
          </div>
        ) : (
          <WorldMap
            gameState={gameState}
            onSelectDestination={handleSelectDestination}
            lang={lang}
          />
        )}
      </div>

      {/* Modals */}
      <TimeKeeperModal
        isOpen={isTimeKeeperOpen}
        onClose={() => setIsTimeKeeperOpen(false)}
        lang={lang}
      />

      <CrystalModal
        isOpen={isCrystalOpen}
        onClose={() => setIsCrystalOpen(false)}
        gameState={gameState}
        onRestoreCrystal={handleRestoreCrystal}
        lang={lang}
      />

      <ArtifactMuseumModal
        isOpen={isMuseumOpen}
        onClose={() => setIsMuseumOpen(false)}
        gameState={gameState}
        lang={lang}
      />

      <AvatarCustomizerModal
        isOpen={isAvatarOpen}
        onClose={() => setIsAvatarOpen(false)}
        gameState={gameState}
        onSelectAvatar={handleSelectAvatar}
        lang={lang}
      />
    </div>
  );
}
