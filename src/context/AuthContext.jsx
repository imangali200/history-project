import React, { createContext, useContext, useState, useEffect } from 'react';
import sounds from '../utils/audio';

const AuthContext = createContext(null);

const STORAGE_KEY = 'sdu_history_user';
const LOGGED_OUT_KEY = 'sdu_history_logged_out';

const DEFAULT_STUDENT = {
  studentId: '220107045',
  password: 'password123',
  name: 'Батыр Сұлтанов',
  nameEn: 'Batyr Sultanov',
  faculty: 'Инженерия және жаратылыстану ғылымдары факультеті (FEAS)',
  facultyEn: 'Faculty of Engineering & Natural Sciences (FEAS)',
  specialty: 'Ақпараттық жүйелер (Information Systems)',
  course: 3,
  xp: 40,
  streak: 1,
  hearts: 5,
  level: 5,
  isNewUser: false,
  completedLessons: ['stone-age-1']
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      if (localStorage.getItem(LOGGED_OUT_KEY) === 'true') {
        return null;
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.completedLessons) {
          parsed.completedLessons = parsed.isNewUser ? [] : ['stone-age-1'];
        }
        return parsed;
      }
      return DEFAULT_STUDENT;
    } catch {
      return DEFAULT_STUDENT;
    }
  });

  const [completedQuests, setCompletedQuests] = useState(1);
  const [dailyGoalProgress, setDailyGoalProgress] = useState(50);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiPromptTopic, setAiPromptTopic] = useState('');
  const [isSoundMuted, setIsSoundMuted] = useState(() => sounds.getMuted());
  const [isChestClaimed, setIsChestClaimed] = useState(false);

  // Sync user state to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage fallback
    }
  }, [user]);

  const login = (userData) => {
    try {
      localStorage.removeItem(LOGGED_OUT_KEY);
    } catch {}
    const enriched = {
      ...userData,
      completedLessons: userData.isNewUser ? [] : (userData.completedLessons || ['stone-age-1']),
      hearts: userData.hearts ?? 5
    };
    setUser(enriched);
    if (userData.isNewUser) {
      setCompletedQuests(0);
      setDailyGoalProgress(0);
    } else {
      setCompletedQuests(1);
      setDailyGoalProgress(50);
    }
  };

  const logout = () => {
    try {
      localStorage.setItem(LOGGED_OUT_KEY, 'true');
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setUser(null);
  };

  const completeLesson = (lessonId, xpEarned = 30) => {
    setUser((prev) => {
      if (!prev) return prev;
      const currentCompleted = prev.completedLessons || [];
      const updatedCompleted = currentCompleted.includes(lessonId)
        ? currentCompleted
        : [...currentCompleted, lessonId];

      const newXp = (prev.xp || 0) + xpEarned;
      const newStreak = Math.max(1, (prev.streak || 0) + 1);
      const newLevel = Math.floor(newXp / 50) + 1;

      return {
        ...prev,
        xp: newXp,
        streak: newStreak,
        isNewUser: false,
        hearts: 5, // Refill hearts on completion
        level: newLevel,
        completedLessons: updatedCompleted
      };
    });
    setCompletedQuests((prev) => Math.min(3, prev + 1));
    setDailyGoalProgress((prev) => Math.min(100, prev + 50));
  };

  const addXp = (amount) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newXp = (prev.xp || 0) + amount;
      const newLevel = Math.floor(newXp / 50) + 1;
      return {
        ...prev,
        xp: newXp,
        level: newLevel
      };
    });
    setCompletedQuests((prev) => Math.min(3, prev + 1));
  };

  const decreaseHeart = () => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        hearts: Math.max(0, (prev.hearts ?? 5) - 1)
      };
    });
  };

  const refillHearts = () => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        hearts: 5
      };
    });
  };

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsSoundMuted(muted);
    return muted;
  };

  const claimChest = () => {
    if (isChestClaimed) return null;
    setIsChestClaimed(true);
    addXp(50);
    refillHearts();
    return { xp: 50, hearts: 5 };
  };

  const askAITutor = (topic = '') => {
    setAiPromptTopic(topic);
    setIsAIModalOpen(true);
  };

  const toggleUserMode = () => {
    if (!user) return;
    const becomesNew = !user.isNewUser && user.xp > 0;
    if (becomesNew) {
      setUser((prev) => ({
        ...prev,
        isNewUser: true,
        xp: 0,
        streak: 0,
        level: 1,
        hearts: 5,
        completedLessons: []
      }));
      setCompletedQuests(0);
      setDailyGoalProgress(0);
    } else {
      setUser((prev) => ({
        ...prev,
        isNewUser: false,
        xp: 40,
        streak: 1,
        level: 5,
        hearts: 5,
        completedLessons: ['stone-age-1']
      }));
      setCompletedQuests(1);
      setDailyGoalProgress(50);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        completeLesson,
        addXp,
        decreaseHeart,
        refillHearts,
        toggleUserMode,
        completedQuests,
        dailyGoalProgress,
        isAIModalOpen,
        setIsAIModalOpen,
        aiPromptTopic,
        askAITutor,
        isSoundMuted,
        toggleSound,
        isChestClaimed,
        claimChest
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
