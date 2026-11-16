import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import sounds from '../utils/audio';

export default function Dashboard({
  user,
  onStartLesson,
  onOpenAI,
  toggleUserMode,
  completedQuests,
  dailyGoalProgress
}) {
  const { t, i18n } = useTranslation();
  const { isChestClaimed, claimChest } = useAuth();
  const [chestMessage, setChestMessage] = useState('');
  const isNew = user.isNewUser || user.xp === 0;
  const currentLang = i18n.language || 'kk';

  const displayName = currentLang === 'en' && user.nameEn ? user.nameEn : user.name;

  const handleOpenChest = () => {
    if (isChestClaimed) return;
    sounds.playFanfare();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
    claimChest();
    setChestMessage(t('dashboard.chest_success'));
    setTimeout(() => setChestMessage(''), 4000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6">
      
      {/* 2-Column Responsive Dashboard Layout (65% / 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        {/* ================= LEFT / MAIN COLUMN (approx 65% width => 8 cols on lg) ================= */}
        <div className="lg:col-span-8 flex flex-col gap-5 sm:gap-6">
          
          {/* 1. HERO BANNER CARD (Mobile-First Responsive) */}
          <section className="relative overflow-hidden rounded-3xl bg-surface-container-lowest p-5 sm:p-6 lg:p-8 shadow-[0_6px_0_0_#dcdad2] border border-surface-container transition-all">
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              
              {/* Mascot (Compact on mobile, full on desktop) */}
              <div className="relative shrink-0 flex items-center justify-center">
                <div className="absolute -inset-2 bg-secondary-fixed/50 rounded-full blur-xl"></div>
                <img
                  alt="Барыс"
                  className="relative w-24 h-24 sm:w-36 sm:h-36 lg:w-44 lg:h-44 object-contain filter drop-shadow-md transition-transform hover:scale-105 duration-200"
                  src={
                    isNew
                      ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCRV2v68VtTYs3MdaTasAutUrXhUjI1XQ775hwq88ApP0tkKLncoF9ZjXQzC-qav-aF2eDXSDEYnAbim0TgJVJy1G-K1HGtwaPfq7WfRoC2zLtE6EDP6PJoD8YUPmKtFHO5QwMk3Hi1-Ogx5D7pxuWJXBbGy4gRgyFqoHz1q4LaT8pgiTuGXaM2f4du3urgozeMKxA7QuapUNKRfg3egzOAsYHPRuJmrDDS3HPuZlrF"
                      : "https://lh3.googleusercontent.com/aida-public/AB6AXuAJW3qFXcjsmoqZzB9NHwplQDC_OcoKmHsraysGaZF5dlIJxRrQR6_7gp3VhGYn-KOpR-ARDqjOe0hKFVYakwS2CTSb_ytVlBMW1jQZlumLsWV8k2rnzUFdPc_3KqeF-iVaQjldnW2mOZwku1X7jD-jvn6DfMnYvwzr1BnMnrVBF4O5LQEoO1ttam0YalRMBbJkvMJHGSf20XQXIeZQV-1MCbQxDDQs7KOvkcBchQAm"
                  }
                />
                <span className="absolute bottom-0 right-1 sm:right-2 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-headline text-[10px] sm:text-xs uppercase font-extrabold shadow-sm">
                  Барыс 🐾
                </span>
              </div>

              {/* Greeting Text & Action */}
              <div className="flex flex-col text-center sm:text-left flex-1 min-w-0 w-full">
                <div className="inline-flex items-center gap-1.5 self-center sm:self-start px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-surface-container-high text-on-surface-variant font-headline text-xs font-bold mb-1.5 sm:mb-2">
                  <span className="material-symbols-outlined text-sm sm:text-base text-primary">explore</span>
                  <span>{t('dashboard.hero_tag')}</span>
                </div>

                <h1 className="font-headline text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight leading-tight">
                  {isNew ? `${t('dashboard.welcome_new').replace('Батыр', displayName)}` : `${t('dashboard.welcome_active').replace('Батыр', displayName)}`}
                </h1>

                <p className="font-body text-xs sm:text-base text-on-surface-variant mt-1 font-semibold">
                  {isNew
                    ? t('dashboard.hero_desc_new')
                    : t('dashboard.hero_desc_active')}
                </p>

                <p className="hidden sm:block font-body text-xs text-outline mb-3 sm:mb-4">
                  {isNew
                    ? t('dashboard.hero_sub_new')
                    : t('dashboard.hero_sub_active')}
                </p>

                {/* Chapter Progress bar for active user */}
                {!isNew && (
                  <div className="my-2 sm:mb-4 p-2.5 sm:p-3 rounded-2xl bg-surface-container-low flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-on-surface">
                      <span className="font-headline text-xs font-bold truncate">{t('dashboard.chapter_progress')}</span>
                      <span className="font-headline text-xs text-primary font-extrabold">2 / 5 (40%)</span>
                    </div>
                    <div className="w-full h-2.5 sm:h-3 bg-surface-container-highest rounded-full overflow-hidden p-0.5">
                      <div className="h-full bg-primary-container rounded-full w-[40%] transition-all duration-700"></div>
                    </div>
                  </div>
                )}

                {/* Primary Action Button (Full-width thumb-friendly on mobile) */}
                <div className="pt-2 sm:pt-1">
                  <button
                    onClick={onStartLesson}
                    className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-2xl bg-primary-container text-on-primary font-headline text-sm sm:text-base font-extrabold tracking-wide shadow-[0_5px_0_0_#46a302] hover:bg-[#4eb502] active:translate-y-1 active:shadow-[0_1px_0_0_#46a302] transition-all cursor-pointer text-center uppercase"
                  >
                    <span className="material-symbols-outlined text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                      play_arrow
                    </span>
                    <span>{isNew ? t('dashboard.btn_start_first') : t('dashboard.btn_continue')}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* MOBILE ONLY: SLEEK COMPACT 2-COL WIDGET (Daily Goal + Mystery Chest) */}
          <div className="grid grid-cols-2 gap-3 lg:hidden">
            {/* Mobile Daily Goal Card */}
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-[0_3px_0_0_#dcdad2] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-secondary-container shrink-0">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">local_fire_department</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-headline text-[10px] text-outline font-extrabold uppercase">
                  {t('dashboard.daily_goal')}
                </span>
                <span className="font-headline text-xs sm:text-sm font-black text-on-surface truncate">
                  {isNew ? 0 : Math.round((30 * dailyGoalProgress) / 100)} / 30 XP
                </span>
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-primary-container rounded-full"
                    style={{ width: `${isNew ? 0 : dailyGoalProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Mobile Mystery Chest Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-secondary-fixed/40 via-surface-container-lowest to-surface-container-lowest border border-secondary-fixed shadow-[0_3px_0_0_#f4bf00] flex items-center gap-2.5">
              <div className="text-2xl shrink-0 animate-bounce">🎁</div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-headline text-[10px] text-on-secondary-fixed font-black uppercase">
                  Күндік бонус
                </span>
                {isChestClaimed ? (
                  <span className="font-headline text-xs font-black text-primary truncate">
                    ✓ Алынды!
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleOpenChest}
                    className="mt-0.5 px-2.5 py-1 rounded-lg bg-secondary-container text-on-secondary-container font-headline text-[10px] font-black uppercase shadow-[0_2px_0_0_#6e5400] active:translate-y-0.5 transition-all text-center"
                  >
                    Ашу (+50 XP)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 2. ONBOARDING / UNLOCKED BADGE SECTION */}
          {isNew ? (
            <section className="rounded-3xl bg-surface-container-lowest p-6 shadow-[0_4px_0_0_#dcdad2] border border-surface-container">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">checklist</span>
                  </div>
                  <div>
                    <h2 className="font-headline text-lg font-extrabold text-on-surface">
                      {t('dashboard.onboarding_title')}
                    </h2>
                    <p className="font-body text-xs text-on-surface-variant">
                      {t('dashboard.onboarding_sub')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high">
                  <span className="font-headline text-xs font-bold text-on-surface">0 / 3</span>
                  <span className="font-body text-[11px] text-outline">{t('dashboard.completed')}</span>
                </div>
              </div>

              {/* Progress track */}
              <div className="h-3 w-full rounded-full bg-surface-container-high overflow-hidden mb-4 p-0.5">
                <div className="h-full rounded-full bg-primary-container w-0 transition-all duration-500"></div>
              </div>

              {/* Checklist Items */}
              <div className="flex flex-col gap-2.5">
                <div
                  onClick={onStartLesson}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors group cursor-pointer shadow-[0_2px_0_0_#e4e3db]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-surface-container-lowest flex items-center justify-center text-outline shadow-[0_2px_0_0_#dcdad2] group-hover:text-primary">
                      <span className="material-symbols-outlined text-lg">radio_button_unchecked</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                        {t('dashboard.step_1_title')}
                      </span>
                      <span className="font-body text-xs text-on-surface-variant">
                        {t('dashboard.step_1_desc')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-headline text-xs font-extrabold shadow-[0_2px_0_0_#f4bf00]">
                    <span className="material-symbols-outlined text-base">military_tech</span>
                    <span>+20 XP</span>
                  </div>
                </div>

                <div
                  onClick={onOpenAI}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors group cursor-pointer shadow-[0_2px_0_0_#e4e3db]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-surface-container-lowest flex items-center justify-center text-outline shadow-[0_2px_0_0_#dcdad2] group-hover:text-tertiary">
                      <span className="material-symbols-outlined text-lg">radio_button_unchecked</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline text-sm font-bold text-on-surface group-hover:text-tertiary transition-colors">
                        {t('dashboard.step_3_title')}
                      </span>
                      <span className="font-body text-xs text-on-surface-variant">
                        {t('dashboard.step_3_desc')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-headline text-xs font-extrabold shadow-[0_2px_0_0_#f4bf00]">
                    <span className="material-symbols-outlined text-base">military_tech</span>
                    <span>+10 XP</span>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            /* Unlocked badge celebration for active user */
            <div className="rounded-3xl bg-secondary-container/15 p-6 shadow-[0_4px_0_0_#f4bf00] flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden border border-secondary-fixed">
              <div className="w-20 h-20 shrink-0 rounded-2xl bg-surface-container-lowest p-2 flex items-center justify-center shadow-[0_3px_0_0_#dcdad2]">
                <img
                  alt="Golden Man Saka warrior helmet badge"
                  className="w-full h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJhrbzOkJskEfaR8Inhc3xyl09WbCvzbAK9ywutGqLC72r-60CjM1CX7rgQSFbNVb2ZVhJko81AJIc0Y9kz5Q73oQbds_Pnk2CrAX5QEN6XehIir-K1U3c13dofbxnhefqaCH51dOji1__WC2bT1evOlMgBSeBReS4_HFITGAyuAec8AKeNw-iDeTSc5mIJ5OpenUptHTCVqJpMk6rMw8-idbxxLllym4eGCvLggpN"
                />
              </div>
              <div className="flex flex-col flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1 text-secondary mb-0.5">
                  <span className="material-symbols-outlined text-xl">military_tech</span>
                  <span className="font-headline text-xs uppercase font-extrabold tracking-wider">
                    {t('dashboard.unlocked_badge')}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="font-headline text-lg font-extrabold text-on-surface">
                    {t('dashboard.badge_name')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-headline text-xs font-extrabold">
                    +20 XP 🌟
                  </span>
                </div>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  {t('dashboard.badge_desc')}
                </p>
              </div>
            </div>
          )}

          {/* 3. RECOMMENDED LESSON CARD */}
          <section className="rounded-3xl bg-surface-container-lowest p-6 shadow-[0_4px_0_0_#dcdad2] border border-surface-container relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-secondary-fixed flex flex-col items-center justify-center text-on-secondary-fixed shrink-0 shadow-[0_3px_0_0_#f4bf00]">
                  <span className="material-symbols-outlined text-2xl">token</span>
                  <span className="font-headline text-[10px] leading-tight uppercase font-extrabold">
                    {isNew ? t('dashboard.lesson_1_badge') : t('dashboard.lesson_3_badge')}
                  </span>
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary font-headline text-xs uppercase font-extrabold tracking-wider">
                      {isNew ? 'Level 1' : 'Level 3'}
                    </span>
                    <span className="text-outline text-xs">•</span>
                    <span className="font-body text-xs text-on-surface-variant flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-base text-secondary">schedule</span> {isNew ? t('dashboard.duration_5min') : t('dashboard.duration_6min')}
                    </span>
                  </div>

                  <h3 className="font-headline text-lg font-extrabold text-on-surface">
                    {isNew ? t('dashboard.lesson_1_title') : t('dashboard.lesson_3_title')}
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant mt-0.5 font-bold">
                    {isNew ? t('dashboard.lesson_1_topic') : t('dashboard.lesson_3_topic')}
                  </p>
                  <p className="font-body text-xs text-outline">
                    {isNew ? t('dashboard.lesson_1_sub') : t('dashboard.lesson_3_sub')}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                <button
                  onClick={onStartLesson}
                  className="w-full md:w-auto px-6 py-3 rounded-2xl bg-primary-container text-on-primary font-headline text-sm font-extrabold shadow-[0_4px_0_0_#46a302] hover:bg-[#4eb502] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-1.5 uppercase"
                >
                  <span>{t('dashboard.start_lesson')}</span>
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>

          {/* 4. TODAY IN HISTORY FUN FACT CARD */}
          <section className="rounded-3xl bg-tertiary-fixed/30 p-5 sm:p-6 shadow-[0_4px_0_0_#c8e6ff] border border-tertiary-fixed/40 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest text-tertiary flex items-center justify-center shrink-0 shadow-[0_3px_0_0_#c8e6ff]">
                <span className="material-symbols-outlined text-3xl">auto_stories</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest text-tertiary font-headline text-xs uppercase font-extrabold shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">lightbulb</span>
                    {t('dashboard.fact_tag')}
                  </span>
                  <span className="font-headline text-sm text-on-surface font-extrabold">
                    {t('dashboard.today_in_history')}
                  </span>
                </div>
                <p className="font-body text-sm text-on-surface leading-relaxed font-semibold">
                  {t('dashboard.fact_text')}
                </p>
                <p className="font-body text-xs text-on-tertiary-container italic">
                  {t('dashboard.fact_sub')}
                </p>
              </div>
            </div>
          </section>

          {/* 5. MOBILE-ONLY COMPACT DAILY QUESTS */}
          <section className="lg:hidden rounded-3xl bg-surface-container-lowest p-5 shadow-[0_4px_0_0_#dcdad2] border border-surface-container">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-2xl">task_alt</span>
                <h2 className="font-headline text-base font-extrabold text-on-surface">{t('dashboard.quests_title')}</h2>
              </div>
              <span className="font-headline text-xs px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-bold">
                {completedQuests} / 3 {t('dashboard.today_quests')}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Quest 1 */}
              <div className="flex flex-col gap-1 p-3 rounded-2xl bg-surface-container-low shadow-[0_2px_0_0_#e4e3db]">
                <div className="flex items-center justify-between text-on-surface">
                  <span className="font-headline text-xs font-bold">{t('dashboard.quest_1')}</span>
                  <span className="font-headline text-xs text-secondary-container font-extrabold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-sm">redeem</span> 10 XP
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="h-2 flex-1 rounded-full bg-surface-container-high overflow-hidden">
                    <div
                      className="h-full bg-primary-container rounded-full transition-all duration-500"
                      style={{ width: completedQuests >= 1 ? '100%' : '0%' }}
                    ></div>
                  </div>
                  <span className="font-headline text-[11px] text-outline font-bold">
                    {completedQuests >= 1 ? '1/1 ✓' : '0/1'}
                  </span>
                </div>
              </div>

              {/* Quest 2 */}
              <div className="flex flex-col gap-1 p-3 rounded-2xl bg-surface-container-low shadow-[0_2px_0_0_#e4e3db]">
                <div className="flex items-center justify-between text-on-surface">
                  <span className="font-headline text-xs font-bold">{t('dashboard.quest_2')}</span>
                  <span className="font-headline text-xs text-secondary-container font-extrabold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-sm">redeem</span> 10 XP
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="h-2 flex-1 rounded-full bg-surface-container-high overflow-hidden">
                    <div
                      className="h-full bg-primary-container rounded-full transition-all duration-500"
                      style={{ width: completedQuests >= 2 ? '100%' : '0%' }}
                    ></div>
                  </div>
                  <span className="font-headline text-[11px] text-outline font-bold">
                    {completedQuests >= 2 ? '1/1 ✓' : '0/1'}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ================= RIGHT COLUMN (Desktop only => 4 cols on lg, hidden on mobile) ================= */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
          
          {/* 1. DAILY GOAL RING */}
          <section className="rounded-3xl bg-surface-container-lowest p-6 shadow-[0_4px_0_0_#dcdad2] border border-surface-container flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="font-headline text-base font-extrabold text-on-surface">{t('dashboard.daily_goal')}</span>
              <span className="font-label-sm text-xs text-outline uppercase tracking-wider font-bold">{t('dashboard.daily_goal_sub')}</span>
            </div>

            {/* Circular Progress Ring */}
            <div className="relative w-32 h-32 my-2 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  className="text-surface-container-high"
                  cx="60"
                  cy="60"
                  fill="none"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="12"
                />
                <circle
                  className="text-primary-container transition-all duration-700"
                  cx="60"
                  cy="60"
                  fill="none"
                  r="48"
                  stroke="currentColor"
                  strokeDasharray="301.6"
                  strokeDashoffset={301.6 - (301.6 * (isNew ? 0 : dailyGoalProgress)) / 100}
                  strokeLinecap="round"
                  strokeWidth="12"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-secondary-container text-2xl">local_fire_department</span>
                <span className="font-headline text-2xl font-extrabold text-on-surface leading-none">
                  {isNew ? 0 : Math.round((30 * dailyGoalProgress) / 100)}
                </span>
                <span className="font-body text-xs text-outline font-bold">/ 30 XP</span>
              </div>
            </div>

            <p className="font-headline text-sm text-on-surface font-extrabold">
              {isNew ? `0% ${t('dashboard.done_percent')}` : `${dailyGoalProgress}% ${t('dashboard.done_percent')}`}
            </p>
            <p className="font-body text-xs text-on-surface-variant mt-0.5">
              {isNew
                ? t('dashboard.daily_goal_hint_new')
                : t('dashboard.daily_goal_hint_active')}
            </p>
          </section>

          {/* MYSTERY DAILY CHEST */}
          <section className="rounded-3xl bg-gradient-to-br from-secondary-fixed/40 via-surface-container-lowest to-surface-container-lowest p-5 sm:p-6 shadow-[0_4px_0_0_#f4bf00] border-2 border-secondary-fixed relative overflow-hidden transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center text-2xl shadow-[0_3px_0_0_#6e5400] shrink-0 animate-bounce">
                🎁
              </div>
              <div className="flex-1 min-w-0">
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-headline text-[10px] uppercase font-extrabold tracking-wider">
                  Daily Bonus
                </span>
                <h3 className="font-headline text-base font-extrabold text-on-surface truncate">
                  {t('dashboard.chest_title')}
                </h3>
              </div>
            </div>

            <p className="font-body text-xs text-on-surface-variant mb-3">
              {isChestClaimed ? t('dashboard.chest_claimed') : t('dashboard.chest_desc')}
            </p>

            {chestMessage && (
              <div className="mb-3 p-2.5 rounded-xl bg-primary-container/20 text-primary border border-primary-container font-headline text-xs font-extrabold text-center animate-pulse">
                {chestMessage}
              </div>
            )}

            {isChestClaimed ? (
              <div className="w-full py-2.5 px-4 rounded-xl bg-primary-container/20 text-primary border border-primary-container font-headline text-xs font-extrabold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>{t('dashboard.chest_claimed')}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleOpenChest}
                className="w-full py-3 px-4 rounded-xl bg-secondary-container hover:bg-[#ffcf1a] active:translate-y-1 text-on-secondary-container font-headline text-xs uppercase font-extrabold shadow-[0_3px_0_0_#6e5400] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">lock_open</span>
                <span>{t('dashboard.chest_btn')}</span>
              </button>
            )}
          </section>

          {/* 2. DAILY QUESTS */}
          <section className="rounded-3xl bg-surface-container-lowest p-6 shadow-[0_4px_0_0_#dcdad2] border border-surface-container">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-2xl">task_alt</span>
                <h2 className="font-headline text-base font-extrabold text-on-surface">{t('dashboard.quests_title')}</h2>
              </div>
              <span className="font-headline text-xs px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-bold">
                {completedQuests} / 3 {t('dashboard.today_quests')}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Quest 1 */}
              <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-surface-container-low shadow-[0_2px_0_0_#e4e3db]">
                <div className="flex items-center justify-between text-on-surface">
                  <span className="font-headline text-xs font-bold">{t('dashboard.quest_1')}</span>
                  <span className="font-headline text-xs text-secondary-container font-extrabold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-base">redeem</span> 10 XP
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 flex-1 rounded-full bg-surface-container-high overflow-hidden">
                    <div
                      className="h-full bg-primary-container rounded-full transition-all duration-500"
                      style={{ width: completedQuests >= 1 ? '100%' : '0%' }}
                    ></div>
                  </div>
                  <span className="font-headline text-[11px] text-outline font-bold">
                    {completedQuests >= 1 ? '1/1 ✓' : '0/1'}
                  </span>
                </div>
              </div>

              {/* Quest 2 */}
              <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-surface-container-low shadow-[0_2px_0_0_#e4e3db]">
                <div className="flex items-center justify-between text-on-surface">
                  <span className="font-headline text-xs font-bold">{t('dashboard.quest_2')}</span>
                  <span className="font-headline text-xs text-secondary-container font-extrabold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-base">redeem</span> 10 XP
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 flex-1 rounded-full bg-surface-container-high overflow-hidden">
                    <div
                      className="h-full bg-primary-container rounded-full transition-all duration-500"
                      style={{ width: completedQuests >= 2 ? '100%' : '0%' }}
                    ></div>
                  </div>
                  <span className="font-headline text-[11px] text-outline font-bold">
                    {completedQuests >= 2 ? '1/1 ✓' : '0/1'}
                  </span>
                </div>
              </div>

              {/* Quest 3 */}
              <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-surface-container-low shadow-[0_2px_0_0_#e4e3db]">
                <div className="flex items-center justify-between text-on-surface">
                  <span className="font-headline text-xs font-bold">{t('dashboard.quest_3')}</span>
                  <span className="font-headline text-xs text-secondary-container font-extrabold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-base">redeem</span> 15 XP
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 flex-1 rounded-full bg-surface-container-high overflow-hidden">
                    <div
                      className="h-full bg-primary-container rounded-full transition-all duration-500"
                      style={{ width: user.streak >= 3 ? '100%' : `${(user.streak / 3) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-headline text-[11px] text-outline font-bold">{user.streak}/3</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. WEEKLY LEADERBOARD PREVIEW */}
          <section className="rounded-3xl bg-surface-container-lowest p-6 shadow-[0_4px_0_0_#dcdad2] border border-surface-container flex flex-col">
            <div className="w-full flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-2xl">trophy</span>
                <span className="font-headline text-base font-extrabold text-on-surface">{t('dashboard.league_title')}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-headline text-xs uppercase font-bold">
                {t('dashboard.league_bronze')}
              </span>
            </div>

            {isNew ? (
              <div className="flex flex-col items-center text-center py-2">
                <div className="w-14 h-14 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary-container shadow-[0_3px_0_0_#f4bf00] mb-2">
                  <span className="material-symbols-outlined text-3xl">shield</span>
                </div>
                <h3 className="font-headline text-sm font-extrabold text-on-surface">
                  {t('dashboard.league_locked_msg')}
                </h3>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  {t('dashboard.league_locked_sub')}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="font-headline text-xs font-extrabold w-5 text-center">🥇</span>
                    <span className="font-headline text-xs font-bold text-on-surface">Айсұлтан</span>
                  </div>
                  <span className="font-headline text-xs font-extrabold text-on-surface">120 XP</span>
                </div>
                <div className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="font-headline text-xs font-extrabold w-5 text-center">🥈</span>
                    <span className="font-headline text-xs font-bold text-on-surface">Мәдина</span>
                  </div>
                  <span className="font-headline text-xs font-extrabold text-on-surface">85 XP</span>
                </div>
                <div className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="font-headline text-xs font-extrabold w-5 text-center">🥉</span>
                    <span className="font-headline text-xs font-bold text-on-surface">Данияр</span>
                  </div>
                  <span className="font-headline text-xs font-extrabold text-on-surface">60 XP</span>
                </div>

                {/* Current User #4 */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-primary-container/20 shadow-[0_2px_0_0_#46a302] border border-primary-container/40">
                  <div className="flex items-center gap-2">
                    <span className="font-headline text-xs font-extrabold w-5 text-primary text-center">4</span>
                    <span className="font-headline text-xs font-extrabold text-on-surface">{displayName} ({t('dashboard.you')})</span>
                  </div>
                  <span className="font-headline text-xs font-extrabold text-primary">{user.xp} XP</span>
                </div>
              </div>
            )}
          </section>

          {/* 4. ACHIEVEMENTS PREVIEW */}
          <section className="rounded-3xl bg-surface-container-lowest p-6 shadow-[0_4px_0_0_#dcdad2] border border-surface-container">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-headline text-base font-extrabold text-on-surface">{t('dashboard.achievements_title')}</h2>
              <span className="font-headline text-xs text-primary font-bold">1 / 12</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-surface-container-low border border-primary-container/40">
                <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-xl">star</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-headline text-xs font-bold text-on-surface truncate">
                    {t('dashboard.badge_1_name')}
                  </span>
                  <span className="font-body text-[11px] text-primary font-bold">
                    {user.xp > 0 ? t('dashboard.badge_1_status_unlocked') : t('dashboard.badge_1_status_locked')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-surface-container-low/60 opacity-70">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-outline shrink-0">
                  <span className="material-symbols-outlined text-xl">lock</span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-headline text-xs font-bold text-on-surface truncate">
                    {t('dashboard.badge_2_name')}
                  </span>
                  <span className="font-body text-[11px] text-outline truncate">
                    {t('dashboard.badge_2_status')}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
