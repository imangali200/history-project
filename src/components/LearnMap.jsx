import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import sounds from '../utils/audio';
import { useAuth } from '../context/AuthContext';

export default function LearnMap({ user, onStartLesson }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addXp } = useAuth();
  const [isMapChestClaimed, setIsMapChestClaimed] = useState(false);
  const [activePopover, setActivePopover] = useState(true);

  const safeUser = user || {
    name: 'Батыр Сұлтанов',
    studentId: '220107045',
    xp: 40,
    streak: 1,
    hearts: 5,
    isNewUser: false,
    completedLessons: ['stone-age-1']
  };
  const isNew = safeUser.isNewUser || (safeUser.xp || 0) === 0;
  const completed = safeUser.completedLessons || (isNew ? [] : ['stone-age-1']);
  const isNode1Done = completed.includes('stone-age-1');
  const isNode2Done = completed.includes('saka-1');
  const isNode2Unlocked = isNode1Done;
  const isNode3Unlocked = isNode2Done;
  const currentLang = i18n.language || 'kk';

  const handleOpenMapChest = () => {
    if (isMapChestClaimed) return;
    sounds.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setIsMapChestClaimed(true);
    addXp(25);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= MAIN EXPEDITION MAP (8 COLS) ================= */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* SECTION BANNER HEADER */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-container p-6 text-on-primary shadow-[0_6px_0_0_#1f5100]">
            <div className="absolute -right-8 -bottom-10 w-52 h-52 rounded-full bg-white/10 pointer-events-none"></div>
            <div className="absolute right-20 -top-8 w-28 h-28 rounded-full bg-secondary-container/20 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm self-start">
                  <span className="material-symbols-outlined text-secondary-container text-base">travel_explore</span>
                  <span className="font-headline text-xs font-bold uppercase tracking-wider text-secondary-fixed">
                    {t('map.section_1_tag')}
                  </span>
                </div>
                <h1 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mt-1">
                  {t('map.section_1_title')}
                </h1>
                <p className="font-body text-xs sm:text-sm text-on-primary/90">
                  {t('map.section_1_desc')}
                </p>
              </div>

              {/* Quick XP Badge */}
              <div className="flex sm:flex-col items-center justify-between sm:items-end gap-1 shrink-0 bg-black/20 p-3 rounded-2xl border border-white/10">
                <span className="font-headline text-[11px] uppercase tracking-wider text-secondary-fixed font-bold">
                  {t('map.xp_earned')}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary-container text-2xl material-symbols-filled">
                    stars
                  </span>
                  <span className="font-headline text-xl font-extrabold text-on-primary">
                    +{safeUser.xp || 40} XP
                  </span>
                </div>
              </div>
            </div>

            {/* Section Progress Bar */}
            <div className="relative z-10 mt-5 pt-3 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-headline text-xs">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <span className="shrink-0 text-white font-bold">
                  {t('map.section_progress_label')}: {completed.length} / 3 {currentLang === 'en' ? 'Topics' : 'Тақырып'}
                </span>
                <div className="w-full h-3.5 bg-black/25 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="h-full bg-secondary-container rounded-full shadow-[inset_0_2px_0_0_rgba(255,255,255,0.4)] transition-all duration-700"
                    style={{ width: `${Math.max(10, Math.min(100, Math.round((completed.length / 3) * 100)))}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-secondary-fixed font-bold tracking-wide">
                {t('map.next_topic')}
              </span>
            </div>
          </div>

          {/* DUOLINGO-STYLE STEPPE ROADMAP */}
          <div className="relative bg-surface-container-low rounded-3xl p-6 sm:p-12 flex flex-col items-center shadow-[0_4px_0_0_#dcdad2] border border-surface-container overflow-hidden">
            
            {/* Background SVG Path */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0"
              preserveAspectRatio="none"
              viewBox="0 0 400 960"
            >
              <path
                d="M 200 40 Q 110 130 140 220 T 260 380 T 150 540 T 250 710 T 200 870"
                fill="none"
                stroke="#2b6c00"
                strokeDasharray="8 12"
                strokeLinecap="round"
                strokeWidth="6"
              />
            </svg>

            {/* Path Container with Interactive Nodes */}
            <div className="relative z-10 w-full max-w-lg flex flex-col gap-12 sm:gap-16 my-4 select-none">
              
              {/* NODE 1: STONE AGE */}
              <div className="relative flex items-center justify-center -translate-x-8 sm:-translate-x-16">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => onStartLesson('stone-age-1')}
                    className={`group relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isNode1Done
                        ? 'bg-primary-container shadow-[0_6px_0_0_#46a302] hover:brightness-105 active:translate-y-1.5 active:shadow-none'
                        : 'bg-primary-container shadow-[0_8px_0_0_#1e5000] ring-4 ring-primary-container/30 hover:scale-105 active:translate-y-1.5 animate-bounce'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-on-primary text-3xl font-extrabold">
                      {isNode1Done ? 'check' : 'play_arrow'}
                    </span>
                    <div className="absolute -top-3 -right-2 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-headline text-[10px] shadow-[0_2px_0_0_#b28b00] uppercase font-black">
                      {isNode1Done ? t('map.completed_badge') : '+20 XP'}
                    </div>
                  </button>

                  {/* 3 Stars for completed */}
                  {isNode1Done && (
                    <div className="flex items-center gap-1 mt-2">
                      <span className="material-symbols-outlined text-secondary-container text-xl material-symbols-filled">star</span>
                      <span className="material-symbols-outlined text-secondary-container text-xl material-symbols-filled">star</span>
                      <span className="material-symbols-outlined text-secondary-container text-xl material-symbols-filled">star</span>
                    </div>
                  )}

                  <span className="mt-2 px-3 py-1 rounded-xl bg-surface-container-lowest font-headline text-xs font-bold text-on-surface text-center shadow-[0_2px_0_0_#dcdad2]">
                    {t('map.node_1_title')}
                  </span>
                  <span className="font-body text-xs text-on-surface-variant font-medium text-center">
                    {t('map.node_1_sub')}
                  </span>
                </div>
              </div>

              {/* ROADMAP TREASURE CHEST CHECKPOINT */}
              <div className="relative flex items-center justify-center -translate-x-2 sm:-translate-x-4 z-20">
                <button
                  type="button"
                  onClick={handleOpenMapChest}
                  className={`group relative p-2.5 sm:p-3 rounded-2xl flex items-center gap-2.5 transition-all cursor-pointer ${
                    isMapChestClaimed
                      ? 'bg-surface-container-high/60 text-outline border border-surface-container shadow-none cursor-default'
                      : 'bg-gradient-to-r from-secondary-fixed to-secondary-container text-on-secondary-fixed shadow-[0_4px_0_0_#b28b00] hover:scale-105 active:translate-y-1 animate-bounce'
                  }`}
                  title={isMapChestClaimed ? 'Олжа алынды' : 'Сыйлық сандығын ашу'}
                >
                  <span className="text-2xl sm:text-3xl">🎁</span>
                  <div className="flex flex-col text-left">
                    <span className="font-headline text-[10px] sm:text-xs font-black uppercase tracking-wider">
                      {isMapChestClaimed ? '✓ Сыйлық алынды (+25 XP)' : 'Сыйлық сандық (+25 XP)'}
                    </span>
                    <span className="font-body text-[10px] text-on-secondary-fixed/80">
                      {isMapChestClaimed ? 'Келесі сабаққа жол ашық' : 'Ашу үшін басыңыз!'}
                    </span>
                  </div>
                </button>
              </div>

              {/* NODE 2: SAKA ERA & GOLDEN MAN (Unlocked if Node 1 Done) */}
              <div className="relative flex items-center justify-center translate-x-8 sm:translate-x-16">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => isNode2Unlocked && onStartLesson('saka-1')}
                    disabled={!isNode2Unlocked}
                    className={`group relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all ${
                      isNode2Done
                        ? 'bg-primary-container shadow-[0_6px_0_0_#46a302] hover:brightness-105 active:translate-y-1.5 cursor-pointer'
                        : isNode2Unlocked
                        ? 'bg-primary-container shadow-[0_8px_0_0_#1e5000] ring-4 ring-primary-container/40 hover:scale-105 active:translate-y-1.5 cursor-pointer animate-pulse'
                        : 'bg-surface-container-high text-outline shadow-[0_5px_0_0_#dcdad2] cursor-not-allowed opacity-90'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-3xl font-extrabold text-on-primary">
                      {isNode2Done ? 'check' : isNode2Unlocked ? 'play_arrow' : 'lock'}
                    </span>
                    {isNode2Unlocked && (
                      <div className="absolute -top-3 -right-2 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-headline text-[10px] shadow-[0_2px_0_0_#b28b00] uppercase font-black">
                        {isNode2Done ? t('map.completed_badge') : '+25 XP'}
                      </div>
                    )}
                  </button>

                  {/* Stars */}
                  {isNode2Done && (
                    <div className="flex items-center gap-1 mt-2">
                      <span className="material-symbols-outlined text-secondary-container text-xl material-symbols-filled">star</span>
                      <span className="material-symbols-outlined text-secondary-container text-xl material-symbols-filled">star</span>
                      <span className="material-symbols-outlined text-secondary-container text-xl material-symbols-filled">star</span>
                    </div>
                  )}

                  <span className="mt-2 px-3 py-1 rounded-xl bg-surface-container-lowest font-headline text-xs font-bold text-on-surface text-center shadow-[0_2px_0_0_#dcdad2]">
                    {t('map.node_2_title')}
                  </span>
                  <span className="font-body text-xs text-on-surface-variant font-medium text-center">
                    {t('map.node_2_sub')}
                  </span>
                </div>
              </div>

              {/* NODE 3: ACTIVE & PULSING (Saka & Tomyris) */}
              <div className="relative flex flex-col items-center justify-center my-4">
                {/* Pulsing Halo & Node Button */}
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-24 h-24 rounded-full bg-primary-container/30 animate-ping pointer-events-none"></span>
                  <span className="absolute w-28 h-28 rounded-full bg-primary/10 pointer-events-none"></span>
                  
                  <button
                    onClick={() => setActivePopover(!activePopover)}
                    className="relative z-20 w-20 h-20 rounded-full bg-primary-container shadow-[0_8px_0_0_#46a302] hover:scale-105 active:translate-y-2 active:shadow-none transition-all flex flex-col items-center justify-center cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-on-primary text-4xl material-symbols-filled">
                      shield
                    </span>
                    <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-headline text-[10px] shadow-[0_2px_0_0_#b28b00] uppercase font-black tracking-wider">
                      {t('map.current_badge')}
                    </div>
                  </button>
                </div>

                {/* POPOVER / ACTIVE QUEST CARD */}
                {activePopover && (
                  <div className="relative z-30 mt-4 w-full max-w-sm rounded-2xl bg-surface-container-lowest p-5 shadow-[0_6px_0_0_#dcdad2] flex flex-col gap-2.5 border border-surface-container animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-headline text-[11px] uppercase tracking-wider font-extrabold">
                        {t('map.step_counter')}
                      </span>
                      <span className="flex items-center gap-1 font-headline text-xs font-bold text-secondary">
                        <span className="material-symbols-outlined text-base">bolt</span> +15 XP
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <h3 className="font-headline text-base font-extrabold text-on-surface leading-tight">
                        {t('map.node_3_title')}
                      </h3>
                      <p className="font-body text-xs text-on-surface-variant font-medium mt-0.5">
                        {t('map.node_3_sub')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 py-2 text-on-surface-variant font-headline text-xs border-t border-surface-container-high">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span> {t('map.duration_6min')}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">quiz</span> {t('map.questions_5')}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-primary font-bold">
                        <span className="material-symbols-outlined text-sm">auto_stories</span> {t('map.fact_tag')}
                      </span>
                    </div>

                    {/* Launch Lesson Button */}
                    <button
                      onClick={() => onStartLesson('saka-1')}
                      className="w-full py-3 px-4 rounded-xl bg-primary-container text-on-primary font-headline text-sm font-extrabold shadow-[0_4px_0_0_#46a302] hover:bg-[#4eb502] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-xl">play_circle</span>
                      <span>{t('map.start_lesson_btn')}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* NODE 4: LOCKED (Golden Man) */}
              <div className="relative flex items-center justify-center -translate-x-8 sm:-translate-x-14 opacity-75">
                <div className="flex flex-col items-center">
                  <button
                    className="relative w-[68px] h-[68px] rounded-full bg-surface-container-highest shadow-[0_6px_0_0_#becbb1] flex items-center justify-center cursor-not-allowed"
                    type="button"
                    title={t('map.locked_msg')}
                  >
                    <span className="material-symbols-outlined text-on-surface-variant text-3xl">lock</span>
                  </button>
                  <span className="mt-2.5 px-3 py-1 rounded-xl bg-surface-container font-headline text-xs font-bold text-on-surface-variant text-center">
                    {t('map.node_4_title')}
                  </span>
                  <span className="font-body text-xs text-on-surface-variant text-center">
                    {t('map.node_4_sub')}
                  </span>
                </div>
              </div>

              {/* NODE 5: BOSS CHALLENGE (Ancient Exam) */}
              <div className="relative flex items-center justify-center translate-x-6 sm:translate-x-10 opacity-85">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <button
                      className="relative w-20 h-20 rounded-2xl bg-secondary-fixed shadow-[0_6px_0_0_#f4bf00] flex flex-col items-center justify-center cursor-not-allowed"
                      type="button"
                      title={t('map.locked_msg')}
                    >
                      <span className="material-symbols-outlined text-on-secondary-fixed text-4xl">swords</span>
                      <span className="material-symbols-outlined absolute -top-3 text-secondary text-2xl material-symbols-filled">crown</span>
                    </button>
                    <span className="absolute -bottom-2 -right-3 px-2 py-0.5 rounded-full bg-error text-on-error font-headline text-[10px] uppercase font-black shadow-[0_2px_0_0_#93000a]">
                      {t('map.boss_badge')}
                    </span>
                  </div>
                  <span className="mt-3 px-3 py-1 rounded-xl bg-surface-container font-headline text-xs font-bold text-on-surface text-center">
                    {t('map.node_5_title')}
                  </span>
                  <span className="font-body text-xs text-primary font-bold">
                    +50 XP Бонус кубок
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* UPCOMING CHAPTER PREVIEWS */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-lg font-extrabold text-on-surface">
                {t('map.upcoming_title')}
              </h3>
              <span className="font-headline text-xs text-on-surface-variant uppercase font-bold">
                {t('map.total_sections')}
              </span>
            </div>

            {/* Chapter 2 Card Preview (Locked) */}
            <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-[0_4px_0_0_#dcdad2] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-surface-container opacity-90">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center shrink-0 text-on-surface-variant shadow-sm">
                  <span className="material-symbols-outlined text-3xl">lock_clock</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline text-xs uppercase tracking-wider text-secondary font-bold">
                    2-Бөлім / Section 2
                  </span>
                  <h4 className="font-headline text-base font-extrabold text-on-surface leading-tight mt-0.5">
                    {t('map.section_2_title')}
                  </h4>
                  <p className="font-body text-xs text-on-surface-variant">
                    {t('map.section_2_desc')}
                  </p>
                </div>
              </div>
              <button
                className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface-variant font-headline text-xs font-bold cursor-not-allowed self-start sm:self-center"
                disabled
                type="button"
              >
                {t('map.locked')}
              </button>
            </div>

            {/* Other Locked Eras Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-[0_3px_0_0_#dcdad2] border border-surface-container flex flex-col gap-1 opacity-70">
                <span className="font-headline text-[10px] text-on-surface-variant uppercase font-bold">3-Бөлім</span>
                <span className="font-headline text-xs font-extrabold text-on-surface leading-snug">Түркі қағанаты</span>
                <span className="font-body text-[11px] text-on-surface-variant">Turkic Khaganate</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-[0_3px_0_0_#dcdad2] border border-surface-container flex flex-col gap-1 opacity-70">
                <span className="font-headline text-[10px] text-on-surface-variant uppercase font-bold">4-Бөлім</span>
                <span className="font-headline text-xs font-extrabold text-on-surface leading-snug">Алтын Орда</span>
                <span className="font-body text-[11px] text-on-surface-variant">Golden Horde</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-[0_3px_0_0_#dcdad2] border border-surface-container flex flex-col gap-1 opacity-70">
                <span className="font-headline text-[10px] text-on-surface-variant uppercase font-bold">5-Бөлім</span>
                <span className="font-headline text-xs font-extrabold text-on-surface leading-snug">Қазақ хандығы</span>
                <span className="font-body text-[11px] text-on-surface-variant">Kazakh Khanate</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-lowest shadow-[0_3px_0_0_#dcdad2] border border-surface-container flex flex-col gap-1 opacity-70">
                <span className="font-headline text-[10px] text-on-surface-variant uppercase font-bold">6-Бөлім</span>
                <span className="font-headline text-xs font-extrabold text-on-surface leading-snug">Тәуелсіз Қазақстан</span>
                <span className="font-body text-[11px] text-on-surface-variant">Modern Era</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= RIGHT GAMIFIED SIDEBAR PANEL (4 COLS) ================= */}
        <aside className="lg:col-span-4 flex flex-col gap-5 lg:sticky lg:top-20">
          
          {/* CARD 0: PRACTICE HUB SHORTCUT */}
          <div className="rounded-2xl bg-gradient-to-br from-tertiary-fixed/30 via-surface-container-lowest to-surface-container-lowest p-5 shadow-[0_4px_0_0_#c8e6ff] border border-tertiary-fixed/60 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-headline text-xs uppercase tracking-wider text-tertiary font-extrabold flex items-center gap-1">
                <span className="material-symbols-outlined text-base">fitness_center</span>
                Жаттығу залы • Practice
              </span>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-headline text-[10px] font-black uppercase">
                Жаңа ⚡
              </span>
            </div>
            <p className="font-body text-xs text-on-surface-variant font-medium">
              3D флеш-карталар мен уақыт сызығы арқылы сабақтарды қайталап, біліміңді бекіт!
            </p>
            <button
              onClick={() => navigate('/practice')}
              type="button"
              className="mt-1 w-full py-2.5 px-3 rounded-xl bg-tertiary text-on-tertiary font-headline text-xs font-extrabold shadow-[0_3px_0_0_#004c6e] hover:bg-tertiary/90 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase"
            >
              <span>Жаттығуды бастау</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

          {/* CARD 1: CURRENT ACTIVE QUEST */}
          <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-[0_4px_0_0_#dcdad2] border border-surface-container flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-headline text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                {t('map.current_mission_title')}
              </span>
              <span className="material-symbols-outlined text-primary text-xl">flag</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center shrink-0 text-tertiary shadow-sm">
                <span className="material-symbols-outlined text-2xl">history_edu</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline text-sm font-extrabold text-on-surface truncate">
                  3-Сабақ: Сақтар
                </span>
                <span className="font-body text-xs text-on-surface-variant truncate">
                  Томирис пен Кир шайқасы
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between font-headline text-xs">
                <span className="text-on-surface">Бөлім орындалуы</span>
                <span className="text-primary font-extrabold">40%</span>
              </div>
              <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-primary-container rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>

          {/* CARD 2: DAILY GOAL (CIRCULAR PROGRESS RING) */}
          <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-[0_4px_0_0_#dcdad2] border border-surface-container flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-headline text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                {t('dashboard.daily_goal')}
              </span>
              <span className="material-symbols-outlined text-secondary text-xl">track_changes</span>
            </div>
            <div className="flex items-center gap-4 py-1">
              <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                <svg className="w-18 h-18 -rotate-90" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" fill="none" r="30" stroke="#eae8e0" strokeWidth="7"></circle>
                  <circle
                    cx="36"
                    cy="36"
                    fill="none"
                    r="30"
                    stroke="#58cc02"
                    strokeDasharray="188.5"
                    strokeDashoffset="94.25"
                    strokeLinecap="round"
                    strokeWidth="7"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-headline text-lg text-on-surface leading-none font-extrabold">15</span>
                  <span className="font-headline text-[10px] text-on-surface-variant uppercase font-bold">/ 30 XP</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-sm text-primary leading-tight font-extrabold">
                  {t('map.half_done')}
                </span>
                <p className="font-body text-xs text-on-surface-variant mt-0.5 leading-snug">
                  {t('map.half_done_sub')}
                </p>
              </div>
            </div>
          </div>

          {/* CARD 3: STREAK FLAME */}
          <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-[0_4px_0_0_#dcdad2] border border-surface-container flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-headline text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                Streak / Күн тізбегі
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-headline text-[10px] font-black uppercase">
                Белсенді
              </span>
            </div>
            <div className="flex items-center gap-3 my-2">
              <div className="relative w-14 h-14 rounded-2xl bg-secondary-fixed flex items-center justify-center shadow-[0_4px_0_0_#f4bf00] shrink-0">
                <span className="material-symbols-outlined text-secondary-container text-4xl material-symbols-filled animate-bounce">
                  local_fire_department
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-headline text-2xl leading-none text-on-surface font-extrabold">{safeUser.streak || 1}</span>
                  <span className="font-headline text-sm text-secondary font-bold">күн</span>
                </div>
                <span className="font-headline text-xs text-primary font-bold">{t('map.streak_keep')}</span>
              </div>
            </div>

            {/* Streak 7-day mini markers */}
            <div className="flex justify-between items-center pt-2 border-t border-surface-container-high mt-1">
              <div className="flex flex-col items-center">
                <span className="font-headline text-[10px] text-on-surface-variant">Дүй</span>
                <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-xs font-bold shadow-[0_2px_0_0_#46a302]">✓</div>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-headline text-[10px] text-primary font-bold">Сей</span>
                <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-xs font-bold ring-2 ring-primary">🔥</div>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <span className="font-headline text-[10px] text-on-surface-variant">Сәр</span>
                <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-xs">·</div>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <span className="font-headline text-[10px] text-on-surface-variant">Бей</span>
                <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-xs">·</div>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <span className="font-headline text-[10px] text-on-surface-variant">Жұм</span>
                <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-xs">·</div>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <span className="font-headline text-[10px] text-on-surface-variant">Сен</span>
                <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-xs">·</div>
              </div>
              <div className="flex flex-col items-center opacity-40">
                <span className="font-headline text-[10px] text-on-surface-variant">Жек</span>
                <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-xs">·</div>
              </div>
            </div>
          </div>

          {/* CARD 4: LEADERBOARD BRONZE LEAGUE PREVIEW */}
          <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-[0_4px_0_0_#dcdad2] border border-surface-container flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary-fixed-dim text-xl material-symbols-filled">
                  military_tech
                </span>
                <span className="font-headline text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                  {t('dashboard.league_bronze')}
                </span>
              </div>
              <span className="font-headline text-[11px] text-on-surface-variant font-semibold">3 күн қалды</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-headline text-xs font-extrabold text-secondary-container w-4 text-center">1</span>
                  <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold">🇰🇿</div>
                  <span className="font-headline text-xs font-bold text-on-surface">Айсұлтан М.</span>
                </div>
                <span className="font-headline text-xs text-on-surface-variant font-bold">120 XP</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-headline text-xs font-extrabold text-outline-variant w-4 text-center">2</span>
                  <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold">🏹</div>
                  <span className="font-headline text-xs font-bold text-on-surface">Томирис С.</span>
                </div>
                <span className="font-headline text-xs text-on-surface-variant font-bold">95 XP</span>
              </div>

              {/* ACTIVE USER */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-primary-container/20 shadow-[0_2px_0_0_#46a302] border border-primary-container/40">
                <div className="flex items-center gap-2">
                  <span className="font-headline text-xs font-extrabold text-primary w-4 text-center">4</span>
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold">
                    {(safeUser.name || 'Б').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline text-xs text-on-surface font-extrabold">
                      {safeUser.name || 'Батыр'} ({t('dashboard.you')})
                    </span>
                    <span className="font-headline text-[10px] text-primary font-bold">Жоғарылау аймағында</span>
                  </div>
                </div>
                <span className="font-headline text-xs text-primary font-black">{safeUser.xp || 40} XP</span>
              </div>
            </div>
          </div>

          {/* CARD 5: HISTORICAL FUN FACT */}
          <div className="rounded-2xl bg-surface-container-low p-5 shadow-[0_3px_0_0_#dcdad2] border border-surface-container flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-secondary">
              <span className="material-symbols-outlined text-base">lightbulb</span>
              <span className="font-headline text-xs uppercase font-bold tracking-wider">
                {t('dashboard.fact_tag')}
              </span>
            </div>
            <p className="font-body text-xs text-on-surface leading-relaxed font-semibold">
              {t('map.today_fact_quote')}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
