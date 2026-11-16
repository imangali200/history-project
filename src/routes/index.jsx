import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

// Pages
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import LearnMapPage from '../pages/LearnMapPage';
import LessonPage from '../pages/LessonPage';
import LeaderboardPage from '../pages/LeaderboardPage';
import AITutorPage from '../pages/AITutorPage';
import PracticePage from '../pages/PracticePage';
import GamesPage from '../pages/GamesPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Standalone Fullscreen Lesson Route (Protected) */}
      <Route
        path="/lesson/:lessonId"
        element={
          <ProtectedRoute>
            <LessonPage />
          </ProtectedRoute>
        }
      />

      {/* Main App Layout (Protected) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="learn" element={<LearnMapPage />} />
        <Route path="map" element={<Navigate to="/learn" replace />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="ai-tutor" element={<AITutorPage />} />
        <Route path="quests" element={<Navigate to="/ai-tutor" replace />} />
        <Route path="practice" element={<PracticePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
