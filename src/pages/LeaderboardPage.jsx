import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function LeaderboardPage() {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const lang = i18n.language === 'en' ? 'en' : 'kk';

  // League filter: 'weekly' (Апталық) | 'allTime' (Жалпы)
  const [filter, setFilter] = useState('weekly');
  const [selectedFaculty, setSelectedFaculty] = useState('all');

  const userXp = user?.xp || 40;
  const userStreak = user?.streak || 1;
  const userName = lang === 'en' && user?.nameEn ? user.nameEn : (user?.name || user?.fullName || 'Батыр Сұлтанов');
  const userStudentId = user?.studentId || '220107045';
  const userFaculty = 'SITAM';

  // Base leaderboard students with authentic SDU profiles
  const BASE_STUDENTS = [
    {
      id: '210107042',
      name: 'Айсұлтан Мұрат',
      nameEn: 'Aisultan Murat',
      faculty: 'SITAM',
      xpWeekly: 540,
      xpAllTime: 1820,
      streak: 14,
      avatar: '🦁',
      avatarBg: 'from-amber-400 to-amber-600',
      badge: 'Сақ батыры'
    },
    {
      id: '220103011',
      name: 'Динара Серік',
      nameEn: 'Dinara Serik',
      faculty: 'SSBL',
      xpWeekly: 490,
      xpAllTime: 1640,
      streak: 11,
      avatar: '🦅',
      avatarBg: 'from-slate-300 to-slate-500',
      badge: 'Дала зерттеушісі'
    },
    {
      id: '200109088',
      name: 'Мадияр Ораз',
      nameEn: 'Madiyar Oraz',
      faculty: 'SSBL',
      xpWeekly: 430,
      xpAllTime: 1490,
      streak: 9,
      avatar: '🐺',
      avatarBg: 'from-amber-600 to-amber-800',
      badge: 'Ботай шебері'
    },
    {
      id: '220107055',
      name: 'Аружан Қанатқызы',
      nameEn: 'Aruzhan Kanat',
      faculty: 'EDU',
      xpWeekly: 180,
      xpAllTime: 720,
      streak: 6,
      avatar: '🧕',
      avatarBg: 'from-teal-400 to-teal-600',
      badge: 'Тарихшы'
    },
    {
      id: '210104019',
      name: 'Ернұр Бақыт',
      nameEn: 'Yernur Bakhyt',
      faculty: 'SITAM',
      xpWeekly: 120,
      xpAllTime: 580,
      streak: 5,
      avatar: '🐎',
      avatarBg: 'from-blue-400 to-blue-600',
      badge: 'Саяхатшы'
    },
    {
      id: '230107004',
      name: 'Әлихан Нұрлан',
      nameEn: 'Alikhan Nurlan',
      faculty: 'SITAM',
      xpWeekly: 75,
      xpAllTime: 360,
      streak: 4,
      avatar: '🏹',
      avatarBg: 'from-emerald-400 to-emerald-600',
      badge: 'Мерген'
    },
    {
      id: '220108033',
      name: 'Томирис Әсет',
      nameEn: 'Tomyris Asset',
      faculty: 'SSBL',
      xpWeekly: 50,
      xpAllTime: 290,
      streak: 3,
      avatar: '👑',
      avatarBg: 'from-purple-400 to-purple-600',
      badge: 'Патшайым'
    },
    {
      id: '230101002',
      name: 'Сұлтан Бейбарыс',
      nameEn: 'Sultan Beibarys',
      faculty: 'SITAM',
      xpWeekly: 30,
      xpAllTime: 180,
      streak: 2,
      avatar: '🛡️',
      avatarBg: 'from-indigo-400 to-indigo-600',
      badge: 'Сарбаз'
    },
  ];

  // Merge current user dynamically and rank them
  const rankedList = useMemo(() => {
    const list = [
      ...BASE_STUDENTS.map((s) => ({
        ...s,
        xp: filter === 'weekly' ? s.xpWeekly : s.xpAllTime,
        displayName: lang === 'en' ? s.nameEn : s.name
      })),
      {
        id: userStudentId,
        name: userName,
        nameEn: userName,
        displayName: `${userName} (${lang === 'en' ? 'You' : 'Сіз'})`,
        faculty: userFaculty,
        xp: filter === 'weekly' ? userXp : userXp * 3 + 120,
        streak: userStreak,
        avatar: '🐾',
        avatarBg: 'from-primary-container to-primary',
        badge: 'SDU Батыры',
        isCurrentUser: true
      }
    ];

    // Filter by faculty if selected
    const filtered = selectedFaculty === 'all'
      ? list
      : list.filter((s) => s.faculty.toLowerCase().includes(selectedFaculty.toLowerCase()) || s.isCurrentUser);

    // Sort by XP descending
    filtered.sort((a, b) => b.xp - a.xp);

    return filtered.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }, [filter, selectedFaculty, userXp, userStreak, userName, userFaculty, userStudentId, lang]);

  // Top 3 for podium
  const first = rankedList[0];
  const second = rankedList[1];
  const third = rankedList[2];
  const restList = rankedList.slice(3);

  const currentUserData = rankedList.find((i) => i.isCurrentUser);
  const currentUserRank = currentUserData?.rank || 4;

  // Next student ahead to catch up
  const nextTarget = rankedList.find((i) => i.rank === currentUserRank - 1);
  const xpNeeded = nextTarget ? Math.max(5, nextTarget.xp - (currentUserData?.xp || 0) + 5) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-28 lg:pb-8">

      {/* ━━━━━━━━━━━━━━━━━━━━━ 1. LEAGUE HERO BANNER (Steppe Emerald & Gold Palette) ━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-[#357c02] to-primary-container border border-primary-container/40 shadow-[0_6px_0_0_#1e5000] p-5 sm:p-7 text-white mb-6">
        {/* Background Steppe Light Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-secondary-container/25 blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/15 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-xs font-headline font-black uppercase tracking-wider text-secondary-fixed mb-2">
              <span className="material-symbols-outlined text-sm text-secondary-container material-symbols-filled">workspace_premium</span>
              <span>SDU • {lang === 'en' ? 'Steppe Gold League' : 'Алтын Дала Лигасы'}</span>
            </div>

            <h1 className="font-headline text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {lang === 'en' ? 'University Leaderboard' : 'Студенттер Рейтингі'} 🏆
            </h1>

            <p className="font-body text-xs sm:text-sm text-white/90 mt-1 max-w-lg font-medium">
              {lang === 'en'
                ? 'Top scholars of Suleyman Demirel University excelling in Kazakhstan History!'
                : 'Сүлеймен Демирел Университеті бойынша Қазақстан тарихын үздік меңгерген көшбасшылар!'}
            </p>

            {/* League promotion zone indicators */}
            <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs font-headline font-bold text-white">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-secondary-fixed border border-white/15">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping" />
                {lang === 'en' ? 'Top 1-3: Gold Champions' : '1-3 орын: Алтын лига'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-white/90 border border-white/10">
                <span className="material-symbols-outlined text-xs">timer</span>
                {lang === 'en' ? 'Season ends in: 2d 14h' : 'Маусым: 2 күн 14 сағ'}
              </span>
            </div>
          </div>

          {/* Current User Quick Stat Pill */}
          <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shrink-0 self-start sm:self-center shadow-inner">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary-container to-secondary-fixed flex items-center justify-center text-on-secondary-container shadow-md font-headline font-black text-xl border border-white/30">
              #{currentUserRank}
            </div>
            <div>
              <div className="font-label-sm text-[10px] uppercase font-black text-secondary-fixed tracking-wider">
                {lang === 'en' ? 'Your Standing' : 'Сіздің орныңыз'}
              </div>
              <div className="font-headline text-base font-black text-white flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-sm text-secondary-container material-symbols-filled">diamond</span>
                <span>{currentUserData?.xp || userXp} XP</span>
              </div>
              {nextTarget && (
                <div className="text-[10px] text-secondary-fixed font-bold mt-0.5">
                  +{xpNeeded} XP {lang === 'en' ? 'to pass #' + (currentUserRank - 1) : 'келесі орынға'}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━ 2. TIME & FACULTY FILTER TABS ━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Weekly vs All-Time Toggle */}
        <div className="flex items-center p-1 bg-surface-container-high rounded-2xl shadow-inner self-start">
          <button
            type="button"
            onClick={() => setFilter('weekly')}
            className={`px-4 py-2 rounded-xl font-headline text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'weekly'
                ? 'bg-surface-container-lowest text-primary shadow-[0_2px_0_0_#dcdad2]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">calendar_view_week</span>
            <span>{lang === 'en' ? 'Weekly League' : 'Апталық лига'}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('allTime')}
            className={`px-4 py-2 rounded-xl font-headline text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'allTime'
                ? 'bg-surface-container-lowest text-primary shadow-[0_2px_0_0_#dcdad2]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">military_tech</span>
            <span>{lang === 'en' ? 'All-Time Ranks' : 'Жалпы рейтинг'}</span>
          </button>
        </div>

        {/* Faculty Filter Pills: SITAM, SSBL, EDU */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: lang === 'en' ? 'All SDU' : 'Барлық SDU' },
            { id: 'SITAM', label: 'SITAM' },
            { id: 'SSBL', label: 'SSBL' },
            { id: 'EDU', label: 'EDU' },
          ].map((fac) => (
            <button
              key={fac.id}
              onClick={() => setSelectedFaculty(fac.id)}
              className={`px-3 py-1.5 rounded-xl font-headline text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedFaculty === fac.id
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {fac.label}
            </button>
          ))}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━ 3. 3D OLYMPIC PODIUM (TOP 3) ━━━━━━━━━━━━━━━━━━━━━ */}
      {first && second && third && (
        <section className="relative mb-8 pt-6">
          <div className="max-w-xl mx-auto flex items-end justify-center gap-2 sm:gap-4 px-2">

            {/* 🥈 SECOND PLACE (Silver) */}
            {second && (
              <div className="flex-1 flex flex-col items-center animate-fadeIn">
                <div className="relative mb-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 p-1 flex items-center justify-center text-3xl sm:text-4xl shadow-md border-2 border-white">
                    {second.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-300 text-slate-800 font-headline font-black text-xs flex items-center justify-center shadow-md border border-white">
                    2
                  </div>
                </div>

                <div className="text-center mb-1">
                  <h3 className="font-headline text-xs sm:text-sm font-black text-on-surface truncate max-w-[100px] sm:max-w-[120px]">
                    {second.displayName}
                  </h3>
                  <div className="font-headline text-xs font-black text-secondary-container mt-0.5">
                    {second.xp} XP
                  </div>
                </div>

                {/* Silver Pedestal */}
                <div className="w-full h-24 sm:h-28 rounded-t-2xl bg-gradient-to-b from-slate-200 to-slate-300 border-t-4 border-slate-400 shadow-md flex flex-col items-center justify-center">
                  <span className="font-headline text-2xl sm:text-3xl font-black text-slate-600">🥈</span>
                  <span className="font-label-sm text-[10px] text-slate-600 uppercase font-bold">2nd</span>
                </div>
              </div>
            )}

            {/* 🥇 FIRST PLACE (Gold Champion - Center & Tallest) */}
            {first && (
              <div className="flex-1 flex flex-col items-center animate-fadeIn -mt-4 z-10">
                {/* Golden Crown */}
                <span className="text-2xl sm:text-3xl animate-bounce mb-1">👑</span>

                <div className="relative mb-2">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-300 via-secondary-container to-amber-500 p-1.5 flex items-center justify-center text-4xl sm:text-5xl shadow-[0_8px_20px_rgba(254,199,0,0.45)] border-4 border-white">
                    {first.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary-container text-on-secondary-container font-headline font-black text-xs sm:text-sm flex items-center justify-center shadow-lg border-2 border-white">
                    1
                  </div>
                </div>

                <div className="text-center mb-1">
                  <h3 className="font-headline text-sm sm:text-base font-black text-on-surface truncate max-w-[120px] sm:max-w-[140px]">
                    {first.displayName}
                  </h3>
                  <div className="font-headline text-xs sm:text-sm font-black text-primary flex items-center justify-center gap-0.5 mt-0.5">
                    <span className="material-symbols-outlined text-xs material-symbols-filled">stars</span>
                    <span>{first.xp} XP</span>
                  </div>
                </div>

                {/* Gold Pedestal */}
                <div className="w-full h-32 sm:h-36 rounded-t-2xl bg-gradient-to-b from-[#ffd700] via-[#fec700] to-[#e6b000] border-t-4 border-amber-300 shadow-xl flex flex-col items-center justify-center text-on-secondary-container">
                  <span className="font-headline text-3xl sm:text-4xl font-black">🥇</span>
                  <span className="font-label-sm text-[11px] uppercase font-black tracking-wider">CHAMPION</span>
                </div>
              </div>
            )}

            {/* 🥉 THIRD PLACE (Bronze) */}
            {third && (
              <div className="flex-1 flex flex-col items-center animate-fadeIn">
                <div className="relative mb-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 p-1 flex items-center justify-center text-3xl sm:text-4xl shadow-md border-2 border-white">
                    {third.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-700 text-amber-100 font-headline font-black text-xs flex items-center justify-center shadow-md border border-white">
                    3
                  </div>
                </div>

                <div className="text-center mb-1">
                  <h3 className="font-headline text-xs sm:text-sm font-black text-on-surface truncate max-w-[100px] sm:max-w-[120px]">
                    {third.displayName}
                  </h3>
                  <div className="font-headline text-xs font-black text-secondary-container mt-0.5">
                    {third.xp} XP
                  </div>
                </div>

                {/* Bronze Pedestal */}
                <div className="w-full h-20 sm:h-24 rounded-t-2xl bg-gradient-to-b from-[#cd7f32] to-[#a05a20] border-t-4 border-amber-500 shadow-md flex flex-col items-center justify-center text-amber-100">
                  <span className="font-headline text-2xl sm:text-3xl font-black">🥉</span>
                  <span className="font-label-sm text-[10px] uppercase font-bold">3rd</span>
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━ 4. FULL RANKINGS LIST ━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-surface-container-lowest rounded-3xl border border-surface-container shadow-[0_6px_0_0_#dcdad2] overflow-hidden">
        {/* Table Header */}
        <div className="p-4 px-5 sm:px-6 bg-surface-container-low border-b border-surface-container flex items-center justify-between font-label-sm text-xs text-outline font-black uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <span className="w-7 text-center">#</span>
            <span>{lang === 'en' ? 'Student' : 'Студент'}</span>
          </div>
          <div className="flex items-center gap-6 sm:gap-10">
            <span className="hidden sm:inline">{lang === 'en' ? 'Faculty' : 'Факультет'}</span>
            <span className="hidden md:inline">{lang === 'en' ? 'Streak' : 'Тізбек'}</span>
            <span>XP</span>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-surface-container-low">
          {rankedList.map((row) => (
            <div
              key={row.id}
              className={`px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3 transition-all ${
                row.isCurrentUser
                  ? 'bg-primary-container/15 border-l-4 border-l-primary font-black shadow-inner'
                  : 'hover:bg-surface-container-low/40'
              }`}
            >
              {/* Left: Rank + Avatar + Name */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <span className={`w-7 text-center font-headline text-base sm:text-lg font-black shrink-0 ${
                  row.rank === 1 ? 'text-[#e6b000]' :
                  row.rank === 2 ? 'text-slate-500' :
                  row.rank === 3 ? 'text-amber-700' :
                  row.isCurrentUser ? 'text-primary scale-110' : 'text-outline'
                }`}>
                  {row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : row.rank}
                </span>

                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm ${
                  row.isCurrentUser ? 'bg-primary text-white ring-2 ring-primary-container' : 'bg-surface-container'
                }`}>
                  {row.avatar}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-headline text-sm sm:text-base font-black truncate ${
                      row.isCurrentUser ? 'text-primary' : 'text-on-surface'
                    }`}>
                      {row.displayName}
                    </span>
                    {row.isCurrentUser && (
                      <span className="px-2 py-0.2 rounded-full bg-primary text-white font-label-sm text-[9px] uppercase font-black shrink-0">
                        {lang === 'en' ? 'YOU' : 'СІЗ'}
                      </span>
                    )}
                  </div>
                  <span className="font-body-sm text-[11px] text-outline truncate">
                    ID: {row.id} · {row.faculty}
                  </span>
                </div>
              </div>

              {/* Right: Faculty + Streak + XP */}
              <div className="flex items-center gap-4 sm:gap-8 shrink-0">
                <span className={`hidden sm:inline-block px-2.5 py-1 rounded-xl text-xs font-headline font-bold ${
                  row.isCurrentUser ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'
                }`}>
                  {row.faculty}
                </span>

                <div className="hidden md:flex items-center gap-1 font-headline text-xs font-extrabold text-secondary">
                  <span className="material-symbols-outlined text-sm material-symbols-filled">local_fire_department</span>
                  <span>{row.streak}d</span>
                </div>

                <div className={`flex items-center gap-1 font-headline text-sm sm:text-base font-black ${
                  row.isCurrentUser ? 'text-primary' : 'text-on-surface'
                }`}>
                  <span className="material-symbols-outlined text-sm sm:text-base text-tertiary material-symbols-filled">diamond</span>
                  <span>{row.xp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━ 5. FLOATING CURRENT USER BAR (STICKY BOTTOM ON MOBILE) ━━━━━━━━━━━━━━━━━━━━━ */}
      {currentUserData && currentUserRank > 3 && (
        <aside aria-label={lang === 'en' ? 'Your Ranking' : 'Сіздің Рейтингіңіз'} className="fixed bottom-20 lg:bottom-4 left-3 right-3 lg:left-72 lg:right-8 z-30 pointer-events-none">
          <div className="pointer-events-auto max-w-xl mx-auto bg-surface-container-lowest/95 backdrop-blur-xl rounded-2xl border-2 border-primary shadow-[0_8px_30px_rgba(43,108,0,0.25)] p-3 px-4 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary text-white font-headline font-black text-sm flex items-center justify-center shadow-sm">
                #{currentUserRank}
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-xs font-black text-on-surface">
                  {lang === 'en' ? 'Your Current Standing' : 'Сіздің осы аптадағы орныңыз'}
                </span>
                <span className="font-body text-[11px] text-primary font-bold">
                  {nextTarget
                    ? `${lang === 'en' ? 'Only' : 'Небәрі'} +${xpNeeded} XP ${lang === 'en' ? 'needed to reach' : 'жинап'} #${currentUserRank - 1} ${lang === 'en' ? 'place' : 'орынға шығыңыз!'}`
                    : lang === 'en' ? 'Top of the league!' : 'Лиганың көшбасшысы!'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-headline text-base font-black text-primary shrink-0">
              <span className="material-symbols-outlined text-base material-symbols-filled">diamond</span>
              <span>{currentUserData.xp} XP</span>
            </div>
          </div>
        </aside>
      )}

    </div>
  );
}
