import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LessonModal from '../components/LessonModal';
import { useAuth } from '../context/AuthContext';

export default function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user, completeLesson } = useAuth();

  const handleClose = () => {
    navigate('/learn');
  };

  const handleCompleteLesson = (xpEarned) => {
    completeLesson(lessonId || 'stone-age-1', xpEarned);
    navigate('/learn');
  };

  return (
    <LessonModal
      isOpen={true}
      lessonId={lessonId || 'stone-age-1'}
      userHearts={user?.hearts || 5}
      onClose={handleClose}
      onCompleteLesson={handleCompleteLesson}
    />
  );
}
