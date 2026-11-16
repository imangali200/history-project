import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Sidebar({ collapsed = false, onToggleCollapse }) {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const navItems = [
    { to: '/dashboard', label: t('nav.home') || 'Басты бет', icon: 'home' },
    { to: '/learn', label: t('nav.learn') || 'Сабақ картасы', icon: 'map' },
    { to: '/practice', label: t('nav.practice') || 'Жаттығулар', icon: 'fitness_center' },
    { to: '/games', label: 'Тарихи Ойындар', icon: 'sports_esports', badge: '10' },
    { to: '/leaderboard', label: t('nav.leaderboards') || 'Көшбасшылар', icon: 'trophy' },
    { to: '/ai-tutor', label: t('nav.ai_tutor') || 'AI Тарихшы', icon: 'psychology' },
    { to: '/profile', label: t('nav.profile') || 'Профиль', icon: 'person' },
  ];

  return (
    <aside
      className={`hidden lg:flex fixed left-0 top-0 h-full ${
        collapsed ? 'w-[76px]' : 'w-64'
      } bg-surface-container-lowest z-50 flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-surface-container transition-all duration-300 ease-in-out select-none`}
    >
      <div className="flex flex-col">
        {/* Brand Header: Clickable logo to toggle collapse/expand */}
        <div
          onClick={onToggleCollapse}
          title={collapsed ? 'Мәзірді ашу үшін логотипті басыңыз' : 'Мәзірді жинау үшін логотипті басыңыз'}
          className={`h-16 ${
            collapsed ? 'px-2 justify-center' : 'px-4 justify-start'
          } flex items-center border-b border-surface-container-low transition-all duration-300 cursor-pointer group hover:bg-surface-container/50 select-none`}
        >
          <Logo size="md" showText={!collapsed} />
        </div>

        {/* Nav list */}
        <nav className="p-2 flex flex-col gap-1.5 mt-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `group relative flex items-center ${
                  collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3.5 py-3'
                } rounded-2xl transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-black shadow-[0_4px_0_0_#337801]'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`material-symbols-outlined text-2xl shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'material-symbols-filled' : ''
                    }`}
                  >
                    {item.icon}
                  </span>

                  {/* Label (hidden in collapsed mode) */}
                  {!collapsed && (
                    <span className="font-headline text-sm font-extrabold truncate flex-1 animate-fadeIn">
                      {item.label}
                    </span>
                  )}

                  {/* Badge */}
                  {!collapsed && item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-headline font-black bg-secondary-container text-on-secondary-container">
                      {item.badge}
                    </span>
                  )}

                  {/* Floating tooltip on hover when collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#181a14] text-white text-xs font-headline font-extrabold rounded-xl shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50 border border-white/10">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Footer */}
      <div className="p-2.5 flex flex-col gap-2 border-t border-surface-container-low">
        {/* Logout */}
        <button
          onClick={logout}
          type="button"
          title={collapsed ? (t('nav.logout') || 'Шығу') : undefined}
          className={`flex items-center ${
            collapsed ? 'justify-center p-2.5' : 'gap-2 px-3 py-2'
          } rounded-xl text-xs text-outline hover:text-error hover:bg-error/5 transition-all font-bold cursor-pointer`}
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          {!collapsed && <span>{t('nav.logout') || 'Шығу'}</span>}
        </button>
      </div>
    </aside>
  );
}
