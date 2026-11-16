import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function MobileNav() {
  const { t } = useTranslation();
  const location = useLocation();

  const tabs = [
    { to: '/dashboard', label: t('nav.home') || 'Басты', icon: 'home' },
    { to: '/learn', label: t('nav.map') || 'Карта', icon: 'explore' },
    { to: '/games', label: 'Ойындар', icon: 'sports_esports' },
    { to: '/practice', label: t('nav.practice') || 'Жаттығу', icon: 'fitness_center' },
    { to: '/leaderboard', label: t('nav.ranks') || 'Рейтинг', icon: 'leaderboard' },
    { to: '/profile', label: t('nav.profile') || 'Профиль', icon: 'person' },
  ];

  const activeIndex = tabs.findIndex(tab => location.pathname.startsWith(tab.to));
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-50 pointer-events-none">
      {/* ── Floating Capsule Bar (Pinterest Dark Pill Inspired) ── */}
      <div className="pointer-events-auto max-w-md mx-auto relative bg-[#181a14]/95 backdrop-blur-2xl rounded-full border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)] px-2 py-1.5 transition-all">
        
        {/* Subtle top edge neon emerald accent highlight */}
        <div
          className="absolute -top-[1px] h-[2.5px] rounded-full bg-gradient-to-r from-transparent via-[#58cc02] to-transparent transition-all duration-300 ease-out pointer-events-none filter drop-shadow-[0_0_6px_#58cc02]"
          style={{
            width: '44px',
            left: `calc(${safeIndex * (100 / tabs.length)}% + ${(100 / tabs.length) / 2}% - 22px)`,
          }}
        />

        {/* Floating active pill highlight backdrop */}
        <div
          className="absolute top-1.5 bottom-1.5 rounded-full bg-white/[0.08] border border-white/5 transition-all duration-300 ease-out pointer-events-none"
          style={{
            width: `calc(${100 / tabs.length}% - 4px)`,
            left: `calc(${safeIndex * (100 / tabs.length)}% + 2px)`,
          }}
        />

        {/* Tabs Row */}
        <div className="relative flex items-center justify-between">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-all duration-200 select-none cursor-pointer ${
                  isActive
                    ? 'text-[#58cc02] scale-[1.03]'
                    : 'text-[#8c9183] hover:text-[#dcdad2] active:scale-95'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`material-symbols-outlined text-[23px] transition-all duration-200 ${
                      isActive ? 'material-symbols-filled filter drop-shadow-[0_0_8px_rgba(88,204,2,0.6)]' : ''
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span
                    className={`font-label-sm text-[10px] tracking-tight leading-none mt-0.5 transition-all ${
                      isActive ? 'font-extrabold text-[#ffffff]' : 'font-semibold'
                    }`}
                  >
                    {tab.label}
                  </span>
                  {/* Glowing active indicator dot */}
                  <div
                    className={`w-1 h-1 rounded-full mt-0.5 transition-all duration-200 ${
                      isActive
                        ? 'bg-[#58cc02] shadow-[0_0_6px_#58cc02] scale-100 opacity-100'
                        : 'opacity-0 scale-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
