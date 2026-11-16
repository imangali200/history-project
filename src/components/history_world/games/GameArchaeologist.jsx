import React, { useState } from 'react';
import sounds from '../../../utils/audio';
import confetti from 'canvas-confetti';

const EXCAVATION_GRID = [
  { id: 0, depth: 2, hasRelic: false, label: 'Тас' },
  { id: 1, depth: 3, hasRelic: true, label: 'Жәдігер Бөлігі' },
  { id: 2, depth: 2, hasRelic: false, label: 'Құм' },
  { id: 3, depth: 2, hasRelic: false, label: 'Саз' },
  { id: 4, depth: 3, hasRelic: true, label: 'Жәдігер Бөлігі' },
  { id: 5, depth: 2, hasRelic: false, label: 'Құмыра' },
  { id: 6, depth: 3, hasRelic: true, label: 'Жәдігер Бөлігі' },
  { id: 7, depth: 2, hasRelic: false, label: 'Сүйек' },
  { id: 8, depth: 2, hasRelic: false, label: 'Күл' }
];

export default function GameArchaeologist({ onComplete, onExit, lang = 'kk' }) {
  const [gridState, setGridState] = useState(EXCAVATION_GRID.map(g => g.depth));
  const [tool, setTool] = useState('shovel'); // 'shovel' | 'brush'
  const [foundRelics, setFoundRelics] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalRelics = EXCAVATION_GRID.filter(g => g.hasRelic).length;

  const handleTileClick = (index) => {
    if (gridState[index] <= 0) return;

    sounds.playTap?.();
    const newGrid = [...gridState];
    newGrid[index] -= 1;
    setGridState(newGrid);

    if (newGrid[index] === 0 && EXCAVATION_GRID[index].hasRelic) {
      sounds.playTileMatch?.();
      const updatedRelics = [...foundRelics, index];
      setFoundRelics(updatedRelics);

      if (updatedRelics.length >= totalRelics) {
        sounds.playFanfare?.();
        setIsCompleted(true);
        confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
      }
    }
  };

  if (isCompleted) {
    return (
      <div className="bg-surface-container-lowest border-2 border-surface-container shadow-[0_8px_0_0_#dcdad2] rounded-3xl p-6 sm:p-10 text-on-surface text-center max-w-2xl mx-auto animate-popIn">
        <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 border-2 border-orange-300 flex items-center justify-center text-4xl mb-4 shadow-[0_4px_0_0_#fdba74]">
          ⛏️
        </div>
        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 font-headline font-black text-xs rounded-full border border-orange-200 mb-2">
          {lang === 'en' ? 'FRAGMENT #8 UNEARTHED' : '8-ШІ СЫНЫҚ ҚАЗЫП АЛЫНДЫ'}
        </span>
        <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface mb-2">
          {lang === 'en' ? 'Archaeological Triumph!' : 'Археологиялық Ұлы Жәдігер Табылды!'}
        </h2>
        <p className="font-body text-on-surface-variant text-xs sm:text-sm max-w-md mx-auto mb-6">
          {lang === 'en'
            ? 'Carefully brushed from the Botai soil strata, you uncovered the Antiquity Fragment and the sacred Bone Bridle!'
            : 'Ботай мәдениетінің мыңжылдық қатпарларынан Көне Дәуір Сыры мен Жылқы Сүйек Ауыздығы аман-есен қазып алынды!'}
        </p>

        {/* Artifact Showcase */}
        <div className="bg-orange-50/60 border-2 border-orange-200 rounded-2xl p-4 mb-6 flex items-center gap-4 text-left max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-orange-100 border border-orange-300 flex items-center justify-center text-3xl">
            ⛏️
          </div>
          <div>
            <div className="text-[10px] text-orange-800 font-headline font-black uppercase tracking-wider">
              {lang === 'en' ? 'Unearthed Relic' : 'Табылған Қасиетті Жәдігер'}
            </div>
            <div className="font-headline text-base font-black text-on-surface">
              {lang === 'en' ? 'Botai Bone Bridle' : 'Ботай Мәдениетінің Сүйек Ауыздығы'}
            </div>
            <div className="text-xs text-on-surface-variant font-medium">
              {lang === 'en' ? '+170 XP • +90 Time Coins' : '+170 XP • +90 Уақыт Монетасы'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onComplete(8)}
          className="w-full max-w-xs py-3.5 bg-primary hover:bg-primary-container text-on-primary font-headline font-black rounded-2xl shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-base"
        >
          {lang === 'en' ? 'Store in Royal Museum' : 'Музейге Сақтап Қайту'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border-2 border-surface-container shadow-[0_8px_0_0_#dcdad2] rounded-3xl p-6 sm:p-8 text-on-surface">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6 border-b border-surface-container pb-4">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-headline font-bold cursor-pointer transition-all shadow-[0_2px_0_0_#dcdad2]"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          {lang === 'en' ? 'Exit Dig Site' : 'Картаға қайту'}
        </button>
        <div className="text-xs font-headline font-black text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
          {foundRelics.length} / {totalRelics} {lang === 'en' ? 'Relic Pieces Found' : 'Жәдігер Бөлігі Табылды'}
        </div>
      </div>

      {/* Brief */}
      <div className="text-center mb-6">
        <h3 className="font-headline text-base sm:text-lg font-black text-on-surface mb-1">
          {lang === 'en' ? 'Botai Settlement Excavation Sector' : 'Ботай Қонысы: Қазба Секторы'}
        </h3>
        <p className="font-body text-xs text-on-surface-variant max-w-md mx-auto font-medium">
          {lang === 'en'
            ? 'Click the dense soil tiles to clear dirt strata layer by layer until the ancient relics are revealed.'
            : 'Топырақ қабаттарын тазарту үшін тақталарды басыңыз. 3 қасиетті жәдігер сынығын толық аршып алыңыз.'}
        </p>
      </div>

      {/* Tool Selector Bar */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setTool('shovel')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-headline font-bold cursor-pointer flex items-center gap-2 border-2 transition-all ${
            tool === 'shovel'
              ? 'bg-orange-500 text-white border-orange-600 shadow-[0_3px_0_0_#c2410c] font-black'
              : 'bg-surface-container-lowest border-surface-container text-on-surface hover:bg-surface-container shadow-[0_2px_0_0_#dcdad2]'
          }`}
        >
          <span className="material-symbols-outlined text-base">construction</span>
          {lang === 'en' ? 'Trench Shovel' : 'Қазба Күрегі'}
        </button>
        <button
          type="button"
          onClick={() => setTool('brush')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-headline font-bold cursor-pointer flex items-center gap-2 border-2 transition-all ${
            tool === 'brush'
              ? 'bg-amber-400 text-stone-950 border-amber-500 shadow-[0_3px_0_0_#d97706] font-black'
              : 'bg-surface-container-lowest border-surface-container text-on-surface hover:bg-surface-container shadow-[0_2px_0_0_#dcdad2]'
          }`}
        >
          <span className="material-symbols-outlined text-base">brush</span>
          {lang === 'en' ? 'Archaeology Brush' : 'Археолог Қылқаламы'}
        </button>
      </div>

      {/* 3x3 Excavation Grid */}
      <div className="max-w-md mx-auto grid grid-cols-3 gap-3.5 mb-6">
        {EXCAVATION_GRID.map((cell, idx) => {
          const depthRemaining = gridState[idx];
          const isCleared = depthRemaining === 0;

          return (
            <button
              key={cell.id}
              type="button"
              onClick={() => handleTileClick(idx)}
              className={`aspect-square rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center p-2 relative overflow-hidden select-none active:scale-95 ${
                isCleared
                  ? cell.hasRelic
                    ? 'bg-amber-100 border-amber-400 shadow-[0_4px_0_0_#fde68a]'
                    : 'bg-surface-container-low border-surface-container'
                  : depthRemaining === 1
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-[0_3px_0_0_#fde68a]'
                  : 'bg-surface-container-lowest border-surface-container text-on-surface-variant hover:border-orange-400 shadow-[0_3px_0_0_#dcdad2]'
              }`}
            >
              {isCleared ? (
                cell.hasRelic ? (
                  <div className="text-center animate-popIn">
                    <span className="text-3xl block">💎</span>
                    <span className="text-[10px] font-headline font-black text-amber-800 mt-1 block">
                      {lang === 'en' ? 'Relic' : 'Жәдігер'}
                    </span>
                  </div>
                ) : (
                  <span className="text-on-surface-variant text-xs font-headline font-bold">
                    {lang === 'en' ? 'Sand' : cell.label}
                  </span>
                )
              ) : (
                <div className="text-center">
                  <span className="text-2xl block mb-1">
                    {depthRemaining > 1 ? '🪨' : '🪵'}
                  </span>
                  <div className="text-[11px] font-headline font-black text-on-surface">
                    {depthRemaining} {lang === 'en' ? 'layers' : 'қатпар'}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
