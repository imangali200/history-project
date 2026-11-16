import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardComponent from '../components/Dashboard';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const {
    user,
    toggleUserMode,
    completedQuests,
    dailyGoalProgress,
    setIsAIModalOpen
  } = useAuth();
  const navigate = useNavigate();

  const handleStartLesson = (lessonId = 'stone-age-1') => {
    navigate(`/lesson/${lessonId || 'stone-age-1'}`);
  };

  return (
    <DashboardComponent
      user={user}
      onStartLesson={handleStartLesson}
      onOpenAI={() => setIsAIModalOpen(true)}
      toggleUserMode={toggleUserMode}
      completedQuests={completedQuests}
      dailyGoalProgress={dailyGoalProgress}
    />
  );
}
