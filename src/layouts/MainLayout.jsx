import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import AITarihshyModal from '../components/AITarihshyModal';
import LessonModal from '../components/LessonModal';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { user, addXp } = useAuth();
  const navigate = useNavigate();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [activeModalLessonId, setActiveModalLessonId] = useState(null);

  // Persistent sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('qazhistory_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleCollapse = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('qazhistory_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const handleCompleteModalLesson = (xpEarned) => {
    addXp(xpEarned);
    setActiveModalLessonId(null);
  };

  return (
    <div className="bg-background min-h-screen text-on-surface flex flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Desktop Navigation Sidebar with smooth collapse */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Column with smooth width transition */}
      <div
        className={`${
          sidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-64'
        } flex flex-col min-h-screen transition-all duration-300 ease-in-out`}
      >
        {/* Top Navbar Status HUD with matching left offset */}
        <Navbar
          sidebarCollapsed={sidebarCollapsed}
          onOpenAI={() => setIsAIModalOpen(true)}
        />

        {/* Dynamic Route Outlet */}
        <main className="w-full pt-16 pb-20 lg:pb-8 flex-1">
          <Outlet context={{ onStartLesson: (id) => navigate(`/lesson/${id || 'stone-age-1'}`) }} />
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>

      {/* AI Historical Tutor Assistant Modal */}
      <AITarihshyModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onAskQuestion={() => addXp(5)}
      />

      {/* Optional In-Place Lesson Modal */}
      {activeModalLessonId && (
        <LessonModal
          isOpen={!!activeModalLessonId}
          lessonId={activeModalLessonId}
          userHearts={user?.hearts || 5}
          onClose={() => setActiveModalLessonId(null)}
          onCompleteLesson={handleCompleteModalLesson}
        />
      )}
    </div>
  );
}
