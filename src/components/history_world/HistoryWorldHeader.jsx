import React from 'react';

export default function HistoryWorldHeader({
  gameState,
  onOpenCrystal,
  onOpenMuseum,
  onOpenAvatar,
  onOpenTimeKeeper,
  lang = 'kk'
}) {
  const fragmentsCount = gameState.collectedFragments?.length || 0;
  const isAllCollected = fragmentsCount >= 10;

  return (
    <header className="relative bg-surface-container-lowest border-2 border-surface-container shadow-[0_4px_0_0_#dcdad2] rounded-3xl p-4 sm:p-5 mb-6 text-on-surface transition-all select-none">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand & Time Keeper Quick Call */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <button
            type="button"
            onClick={onOpenTimeKeeper}
            title={lang === 'en' ? 'Consult Time Keeper' : 'Уақыт Сақшысынан ақыл сұрау'}
            className="w-13 h-13 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-[0_3px_0_0_#d97706] active:translate-y-1 active:shadow-none transition-all cursor-pointer shrink-0"
          >
            🧙‍♂️
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-headline font-black tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                HISTORY WORLD
              </span>
              <span className="text-[11px] text-on-surface-variant font-bold font-body">
                {lang === 'en' ? 'Steppe Odyssey' : 'Ұлы Дала Саяхаты'}
              </span>
            </div>
            <h1 className="font-headline text-lg sm:text-xl font-black text-on-surface tracking-tight flex items-center gap-2 mt-0.5">
              <span>{lang === 'en' ? 'Historical Adventure World' : 'Тарих Әлемі Ойындары'}</span>
            </h1>
          </div>
        </div>

        {/* Center: Crystal Meter */}
        <button
          type="button"
          onClick={onOpenCrystal}
          className={`flex items-center gap-3 px-4 py-2 rounded-2xl border-2 transition-all cursor-pointer ${
            isAllCollected
              ? 'bg-cyan-100 border-cyan-400 shadow-[0_4px_0_0_#0891b2] text-cyan-950 animate-pulse'
              : 'bg-cyan-50/70 hover:bg-cyan-100/70 border-cyan-200/80 shadow-[0_3px_0_0_#a5f3fc] text-cyan-900'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-200/80 border border-cyan-300 flex items-center justify-center text-2xl shadow-sm">
            💎
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-wider font-headline font-black text-cyan-700">
              {lang === 'en' ? 'Time Crystal' : 'Уақыт Кристалы'}
            </div>
            <div className="text-sm font-headline font-black font-mono flex items-center gap-1.5 text-cyan-950">
              <span>{fragmentsCount} / 10</span>
              <span className="text-[10px] text-cyan-700 font-body font-semibold">
                {lang === 'en' ? 'fragments' : 'сынық'}
              </span>
            </div>
          </div>
        </button>

        {/* Right: Currency & Stats & Modals */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Museum button */}
          <button
            type="button"
            onClick={onOpenMuseum}
            title={lang === 'en' ? 'Royal Artifact Museum' : 'Қасиетті Жәдігерлер Музейі'}
            className="px-3.5 py-2 rounded-2xl bg-surface-container-low hover:bg-surface-container border-2 border-surface-container hover:border-primary/40 text-on-surface text-xs font-headline font-black shadow-[0_3px_0_0_#dcdad2] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <span className="text-base">🏺</span>
            <span className="hidden sm:inline">
              {lang === 'en' ? 'Museum' : 'Музей'}
            </span>
            <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-black border border-amber-200">
              {gameState.artifacts?.length || 0}
            </span>
          </button>

          {/* Time Coins */}
          <div className="px-3 py-2 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 shadow-[0_3px_0_0_#fde68a] flex items-center gap-1.5 font-headline font-black text-xs">
            <span>🪙</span>
            <span>{gameState.coins}</span>
          </div>

          {/* Avatar Profile */}
          <button
            type="button"
            onClick={onOpenAvatar}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-primary/10 hover:bg-primary/20 border-2 border-primary/30 shadow-[0_3px_0_0_#bbf7d0] active:translate-y-0.5 active:shadow-none cursor-pointer transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-white border border-primary/30 flex items-center justify-center text-lg shadow-sm">
              {gameState.avatar === 'tomyris' ? '👑' : gameState.avatar === 'batyr' ? '🛡️' : gameState.avatar === 'scholar' ? '📜' : gameState.avatar === 'khan' ? '🦅' : '🏹'}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-[10px] text-primary/80 font-bold font-body leading-none">
                {lang === 'en' ? 'Title' : 'Дәреже'}
              </div>
              <div className="text-xs font-headline font-black text-on-surface leading-tight">
                {lang === 'en' ? (gameState.playerTitleEn || 'Nomad') : (gameState.playerTitle || 'Мерген')}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
