import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar({ sidebarCollapsed = false }) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const currentLang = i18n.language || 'kk';

  const toggleLanguage = () => {
    i18n.changeLanguage(currentLang === 'kk' ? 'en' : 'kk');
  };

  if (!user) return null;

  const displayName = currentLang === 'en' && user.nameEn ? user.nameEn : (user.name || user.fullName || 'Студент');

  return (
    <header className={`fixed top-0 left-0 ${
      sidebarCollapsed ? 'lg:left-[76px]' : 'lg:left-64'
    } right-0 h-16 bg-surface/85 backdrop-blur-xl z-40 px-3 sm:px-6 md:px-8 flex items-center justify-between border-b border-surface-container/60 transition-all duration-300 ease-in-out`}>
      {/* ── Left: Logo & Brand ── */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <div className="lg:hidden flex items-center">
          <Logo size="sm" showText={false} />
        </div>

        {/* Student ID Badge on Desktop */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/80 text-on-surface-variant text-xs font-headline font-bold border border-surface-container-highest/60">
          <span className="material-symbols-outlined text-sm text-primary">badge</span>
          <span>ID: {user.studentId || '—'}</span>
        </div>
      </div>

      {/* ── Right: Stats & Right-aligned Language Switcher ── */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Streak Pill */}
        <div
          title={`${user.streak || 0} days streak`}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low border border-surface-container text-on-surface shadow-[0_2px_0_0_#dcdad2]"
        >
          <span className={`material-symbols-outlined text-base sm:text-lg ${user.streak > 0 ? 'text-secondary-container material-symbols-filled animate-pulse' : 'text-outline'}`}>
            local_fire_department
          </span>
          <span className="font-headline text-xs sm:text-sm font-extrabold">{user.streak || 0}</span>
        </div>

        {/* Hearts Pill */}
        <div
          title="Hearts"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low border border-surface-container text-on-surface shadow-[0_2px_0_0_#dcdad2]"
        >
          <span className="material-symbols-outlined text-error text-base sm:text-lg material-symbols-filled">
            favorite
          </span>
          <span className="font-headline text-xs sm:text-sm font-extrabold">{user.hearts ?? 5}</span>
        </div>

        {/* XP Diamond Pill */}
        <div
          title="XP"
          className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low border border-surface-container text-on-surface shadow-[0_2px_0_0_#dcdad2]"
        >
          <span className="material-symbols-outlined text-tertiary-container text-base sm:text-lg material-symbols-filled">
            diamond
          </span>
          <span className="font-headline text-xs sm:text-sm font-extrabold">{user.xp || 0}</span>
        </div>

        {/* ── Beautiful Right-aligned Language Toggle Pill ── */}
        <button
          onClick={toggleLanguage}
          type="button"
          title={currentLang === 'kk' ? 'Switch to English' : 'Қазақ тіліне ауыстыру'}
          className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest hover:bg-surface-container border border-surface-container-highest shadow-[0_2px_0_0_#dcdad2] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ml-1"
        >
          <span className="text-sm transition-transform group-hover:scale-110">
            {currentLang === 'kk' ? '🇰🇿' : '🇬🇧'}
          </span>
          <span className="font-headline text-xs font-black tracking-wider text-on-surface uppercase">
            {currentLang === 'kk' ? 'ҚАЗ' : 'ENG'}
          </span>
          <span className="material-symbols-outlined text-[13px] text-outline group-hover:text-primary transition-colors">
            sync_alt
          </span>
        </button>

        {/* Desktop: Avatar + Level Pill */}
        <div className="hidden lg:flex items-center gap-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center font-headline text-xs font-black shadow-sm ring-2 ring-surface-container">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-headline text-xs uppercase font-extrabold shadow-sm">
            {t('nav.level')} {user.level || 1}
          </span>
        </div>
      </div>
    </header>
  );
}
