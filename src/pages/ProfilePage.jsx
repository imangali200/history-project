import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import CertificateModal from '../components/CertificateModal';

// ─── Clean settings-style row item ──────────────────────────────────────
function SettingsRow({ icon, iconBg, label, value, onClick, danger, chevron = true }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-all active:bg-surface-container-high/40 cursor-pointer ${
        danger ? 'text-error' : 'text-on-surface'
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg || 'bg-surface-container-low'}`}>
        <span className={`material-symbols-outlined text-lg ${danger ? 'text-error' : ''}`}>{icon}</span>
      </div>
      <span className="flex-1 font-headline text-sm font-bold">{label}</span>
      {value && (
        <span className="font-body text-xs text-outline mr-1">{value}</span>
      )}
      {chevron && (
        <span className="material-symbols-outlined text-lg text-outline/50">chevron_right</span>
      )}
    </button>
  );
}

// ─── Divider ────────────────────────────────────────────────────────────
function Divider() {
  return <div className="h-px bg-surface-container ml-16 mr-4" />;
}

export default function ProfilePage() {
  const { i18n } = useTranslation();
  const { user, toggleUserMode, logout, isSoundMuted, toggleSound } = useAuth();
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const lang = i18n.language === 'en' ? 'en' : 'kk';

  if (!user) return null;

  const displayName = lang === 'en' && user.nameEn ? user.nameEn : (user.name || user.fullName || 'Студент');
  const xp = user.xp || 0;
  const streak = user.streak || 0;
  const hearts = user.hearts ?? 5;
  const level = user.level || 1;
  const completedCount = user.completedLessons?.length || 0;

  const BADGES = [
    { id: 'b1', title: { kk: 'Алғашқы саяхатшы', en: 'First Explorer' }, icon: 'explore', color: 'from-primary-container to-primary', unlocked: true },
    { id: 'b2', title: { kk: 'Сақ батыры', en: 'Saka Champion' }, icon: 'workspace_premium', color: 'from-secondary-container to-secondary', unlocked: xp >= 40 },
    { id: 'b3', title: { kk: 'Ботай зерттеушісі', en: 'Botai Scholar' }, icon: 'auto_awesome', color: 'from-tertiary-container to-tertiary', unlocked: xp >= 70 },
    { id: 'b4', title: { kk: 'Дала Тарханы', en: 'Steppe Tarkhan' }, icon: 'military_tech', color: 'from-[#fec700] to-[#755b00]', unlocked: completedCount >= 2 },
    { id: 'b5', title: { kk: '100 XP Шебері', en: '100 XP Master' }, icon: 'diamond', color: 'from-tertiary to-[#004c6e]', unlocked: xp >= 100 },
    { id: 'b6', title: { kk: 'Апталық жүлдегер', en: 'Weekly Champion' }, icon: 'trophy', color: 'from-primary to-[#082100]', unlocked: streak >= 7 },
  ];
  const unlockedCount = BADGES.filter(b => b.unlocked).length;

  // Streak week dots
  const weekDays = lang === 'en'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сб', 'Жк'];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-4 sm:py-6 pb-28 lg:pb-8">

      {/* ━━━━━━━━━━━━ PROFILE HERO CARD ━━━━━━━━━━━━ */}
      <section className="relative overflow-hidden rounded-[2rem] bg-surface-container-lowest border border-surface-container shadow-[0_6px_0_0_#dcdad2] mb-4">
        {/* Soft decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary-container/12 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-secondary-container/12 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center pt-8 pb-6 px-5">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center font-headline text-4xl font-black shadow-[0_4px_16px_rgba(43,108,0,0.25)] ring-4 ring-surface-container-lowest">
              {displayName.charAt(0).toUpperCase()}
            </div>
            {/* Level badge */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-headline text-[10px] font-black shadow-[0_2px_0_0_#755b00] ring-2 ring-surface-container-lowest">
              {level}
            </div>
          </div>

          {/* Name */}
          <h1 className="font-headline text-xl font-black text-on-surface text-center leading-tight">
            {displayName}
          </h1>

          {/* Email */}
          <p className="font-body text-xs text-outline mt-1">
            {user.email || `${user.studentId || '—'}@sdu.edu.kz`}
          </p>

          {/* Role tags */}
          <div className="flex items-center gap-1.5 mt-2.5 text-on-surface-variant">
            <span className="font-body text-xs font-semibold">
              {lang === 'en' ? 'SDU Student' : 'СДУ студенті'}
            </span>
            <span className="text-outline/40">·</span>
            <span className="inline-flex items-center gap-0.5 font-body text-xs font-semibold">
              <span className="material-symbols-outlined text-xs text-secondary">location_on</span>
              {lang === 'en' ? 'Kaskelen, KZ' : 'Қаскелен, ҚЗ'}
            </span>
          </div>

          {/* Certificate button */}
          <button
            onClick={() => setIsCertOpen(true)}
            className="mt-5 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-container to-primary text-on-primary font-headline text-xs font-black shadow-[0_3px_0_0_#1e5000] flex items-center gap-2 cursor-pointer hover:brightness-105 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined text-base">workspace_premium</span>
            <span>{lang === 'en' ? 'View Certificate' : 'Сертификатты көру'}</span>
          </button>
        </div>

        {/* ── Inline Stats Bar ── */}
        <div className="border-t border-surface-container bg-surface-container-low/30 px-3 py-3">
          <div className="grid grid-cols-4 divide-x divide-surface-container">
            {[
              { val: xp, label: 'XP', color: 'text-tertiary' },
              { val: `${streak}🔥`, label: lang === 'en' ? 'Streak' : 'Тізбек', color: 'text-secondary' },
              { val: `${hearts}❤️`, label: lang === 'en' ? 'Hearts' : 'Жүрек', color: 'text-error' },
              { val: `${completedCount}/5`, label: lang === 'en' ? 'Lessons' : 'Сабақ', color: 'text-primary' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center py-0.5">
                <span className={`font-headline text-base font-black ${s.color}`}>{s.val}</span>
                <span className="font-label-sm text-[9px] text-outline font-bold uppercase tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━ LEARNING & PROGRESS ━━━━━━━━━━━━ */}
      <section className="rounded-2xl bg-surface-container-lowest border border-surface-container shadow-[0_3px_0_0_#dcdad2] overflow-hidden mb-3">
        <div className="px-4 pt-3.5 pb-1">
          <span className="font-label-sm text-[10px] text-outline font-bold uppercase tracking-widest">
            {lang === 'en' ? 'Learning' : 'Оқу'}
          </span>
        </div>

        {/* XP Progress */}
        <SettingsRow
          icon="diamond"
          iconBg="bg-tertiary/10 text-tertiary"
          label={lang === 'en' ? 'XP Progress' : 'XP Прогресс'}
          value={`${xp} / ${level * 50} XP`}
          onClick={() => {}}
          chevron={false}
        />
        {/* Mini progress bar */}
        <div className="px-4 pb-3 -mt-1 ml-[52px]">
          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-tertiary-container to-tertiary rounded-full transition-all duration-700"
              style={{ width: `${Math.min((xp / (level * 50)) * 100, 100)}%` }}
            />
          </div>
        </div>

        <Divider />

        {/* Course Progress */}
        <SettingsRow
          icon="school"
          iconBg="bg-primary/10 text-primary"
          label={lang === 'en' ? 'Course Progress' : 'Курс прогресі'}
          value={`${completedCount}/5 (${Math.round(completedCount / 5 * 100)}%)`}
          onClick={() => {}}
          chevron={false}
        />

        <Divider />

        {/* Badges */}
        <SettingsRow
          icon="military_tech"
          iconBg="bg-secondary/10 text-secondary"
          label={lang === 'en' ? 'Badges & Achievements' : 'Жетістіктер мен медальдар'}
          value={`${unlockedCount}/${BADGES.length}`}
          onClick={() => setShowBadges(!showBadges)}
        />

        {/* Expandable badges grid */}
        {showBadges && (
          <div className="px-4 pb-4 animate-fadeIn">
            <div className="grid grid-cols-3 gap-2 ml-[36px]">
              {BADGES.map((b) => (
                <div
                  key={b.id}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                    b.unlocked
                      ? 'bg-surface-container-low'
                      : 'bg-surface-container-highest/20 opacity-40'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    b.unlocked
                      ? `bg-gradient-to-br ${b.color} text-white shadow-md`
                      : 'bg-surface-container text-outline'
                  }`}>
                    <span className="material-symbols-outlined text-xl material-symbols-filled">
                      {b.unlocked ? b.icon : 'lock'}
                    </span>
                  </div>
                  <span className="font-label-sm text-[9px] text-center font-bold text-on-surface-variant leading-tight">
                    {b.title[lang]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Divider />

        {/* Streak */}
        <SettingsRow
          icon="local_fire_department"
          iconBg="bg-secondary/10 text-secondary-container"
          label={lang === 'en' ? 'Day Streak' : 'Күн тізбегі'}
          value={`${streak} ${lang === 'en' ? 'days' : 'күн'}`}
          onClick={() => setShowStreak(!showStreak)}
        />

        {/* Expandable streak calendar */}
        {showStreak && (
          <div className="px-4 pb-4 animate-fadeIn">
            <div className="flex items-center justify-center gap-2 ml-[36px] p-3 rounded-xl bg-surface-container-low">
              {weekDays.map((d, i) => {
                const active = i <= todayIdx && i > todayIdx - streak;
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="font-label-sm text-[8px] text-outline font-bold">{d}</span>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-headline text-[10px] font-black transition-all ${
                        active
                          ? 'bg-secondary-container text-on-secondary-container shadow-[0_2px_0_0_#755b00]'
                          : i <= todayIdx
                            ? 'bg-surface-container-high text-outline'
                            : 'bg-surface-container text-outline/30'
                      }`}
                    >
                      {active ? '🔥' : '·'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Milestones */}
            <div className="ml-[36px] mt-2 space-y-1">
              {[
                { days: 3, label: { kk: '3 күн', en: '3 Days' }, icon: '🌱' },
                { days: 7, label: { kk: '7 күн', en: '7 Days' }, icon: '⭐' },
                { days: 30, label: { kk: '30 күн', en: '30 Days' }, icon: '🏆' },
              ].map(m => (
                <div key={m.days} className="flex items-center gap-2 text-xs">
                  <span>{m.icon}</span>
                  <span className={`font-headline font-bold ${streak >= m.days ? 'text-secondary' : 'text-outline'}`}>
                    {m.label[lang]}
                  </span>
                  {streak >= m.days ? (
                    <span className="material-symbols-outlined text-primary text-sm material-symbols-filled">check_circle</span>
                  ) : (
                    <span className="text-outline text-[10px]">{m.days - streak} {lang === 'en' ? 'to go' : 'қалды'}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Divider />

        {/* Hearts */}
        <div className="flex items-center gap-3.5 px-4 py-3.5">
          <div className="w-9 h-9 rounded-xl bg-error/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg text-error material-symbols-filled">favorite</span>
          </div>
          <span className="flex-1 font-headline text-sm font-bold text-on-surface">
            {lang === 'en' ? 'Hearts' : 'Жүректер'}
          </span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`material-symbols-outlined text-lg material-symbols-filled ${
                  i < hearts ? 'text-error' : 'text-surface-container-highest'
                }`}
              >
                favorite
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━ PREFERENCES ━━━━━━━━━━━━ */}
      <section className="rounded-2xl bg-surface-container-lowest border border-surface-container shadow-[0_3px_0_0_#dcdad2] overflow-hidden mb-3">
        <div className="px-4 pt-3.5 pb-1">
          <span className="font-label-sm text-[10px] text-outline font-bold uppercase tracking-widest">
            {lang === 'en' ? 'Preferences' : 'Баптаулар'}
          </span>
        </div>

        {/* Language */}
        <SettingsRow
          icon="translate"
          iconBg="bg-primary/10 text-primary"
          label={lang === 'en' ? 'Language' : 'Тіл'}
          value={lang === 'en' ? 'English' : 'Қазақша'}
          onClick={() => i18n.changeLanguage(lang === 'en' ? 'kk' : 'en')}
        />

        <Divider />

        {/* Sound */}
        <div className="flex items-center gap-3.5 px-4 py-3.5">
          <div className="w-9 h-9 rounded-xl bg-tertiary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg text-tertiary">
              {isSoundMuted ? 'volume_off' : 'volume_up'}
            </span>
          </div>
          <span className="flex-1 font-headline text-sm font-bold text-on-surface">
            {lang === 'en' ? 'Sound Effects' : 'Дыбыс эффектілер'}
          </span>
          {/* Toggle switch */}
          <button
            onClick={toggleSound}
            className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${
              !isSoundMuted ? 'bg-primary' : 'bg-surface-container-highest'
            }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${
              !isSoundMuted ? 'left-[22px]' : 'left-0.5'
            }`} />
          </button>
        </div>

        <Divider />

        {/* Appearance / Theme (decorative) */}
        <SettingsRow
          icon="palette"
          iconBg="bg-secondary/10 text-secondary"
          label={lang === 'en' ? 'Appearance' : 'Сыртқы түр'}
          value={lang === 'en' ? 'Light' : 'Жарық'}
          onClick={() => {}}
        />
      </section>

      {/* ━━━━━━━━━━━━ ACCOUNT ━━━━━━━━━━━━ */}
      <section className="rounded-2xl bg-surface-container-lowest border border-surface-container shadow-[0_3px_0_0_#dcdad2] overflow-hidden mb-3">
        <div className="px-4 pt-3.5 pb-1">
          <span className="font-label-sm text-[10px] text-outline font-bold uppercase tracking-widest">
            {lang === 'en' ? 'Account' : 'Аккаунт'}
          </span>
        </div>

        {/* Student ID */}
        <SettingsRow
          icon="badge"
          iconBg="bg-surface-container-low text-on-surface-variant"
          label={lang === 'en' ? 'Student ID' : 'Студент ID'}
          value={user.studentId || '—'}
          onClick={() => {}}
          chevron={false}
        />

        <Divider />

        {/* Faculty */}
        <SettingsRow
          icon="apartment"
          iconBg="bg-surface-container-low text-on-surface-variant"
          label={lang === 'en' ? 'Faculty' : 'Факультет'}
          value={user.faculty || (lang === 'en' ? 'FEAS' : 'Инженерия (FEAS)')}
          onClick={() => {}}
          chevron={false}
        />

        <Divider />

        {/* Demo toggle */}
        <SettingsRow
          icon="swap_horiz"
          iconBg="bg-surface-container-low text-on-surface-variant"
          label={lang === 'en' ? 'Toggle Demo State' : 'Демо режимін ауыстыру'}
          onClick={toggleUserMode}
        />

        <Divider />

        {/* Logout */}
        <SettingsRow
          icon="logout"
          iconBg="bg-error/10"
          label={lang === 'en' ? 'Log Out' : 'Жүйеден шығу'}
          onClick={logout}
          danger
          chevron={false}
        />
      </section>

      {/* Version footer */}
      <p className="text-center font-body text-[10px] text-outline/50 mt-4 mb-2">
        QazHistory v1.0 · SDU 2026
      </p>

      {/* Certificate Modal */}
      <CertificateModal isOpen={isCertOpen} onClose={() => setIsCertOpen(false)} />
    </div>
  );
}
