import React from 'react';
import { useNavigate } from 'react-router-dom';
import LearnMapComponent from '../components/LearnMap';
import { useAuth } from '../context/AuthContext';

export default function LearnMapPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartLesson = (lessonId = 'stone-age-1') => {
    navigate(`/lesson/${lessonId || 'stone-age-1'}`);
  };

  return <LearnMapComponent user={user} onStartLesson={handleStartLesson} />;
}
