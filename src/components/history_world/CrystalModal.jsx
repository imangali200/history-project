import React from 'react';
import { DESTINATIONS } from './historyWorldData';
import sounds from '../../utils/audio';
import confetti from 'canvas-confetti';

export default function CrystalModal({ isOpen, onClose, gameState, onRestoreCrystal, lang = 'kk' }) {
  if (!isOpen) return null;

  const collected = gameState.collectedFragments || [];
  const total = 10;
  const isComplete = collected.length >= total;

  const handleRestore = () => {
    sounds.playFanfare?.();
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    if (onRestoreCrystal) {
      onRestoreCrystal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-surface-container-lowest border-2 border-surface-container shadow-[0_12px_40px_rgba(0,0,0,0.2)] p-6 sm:p-8 text-on-surface animate-popIn">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playTap?.();
            onClose();
          }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center cursor-pointer transition-all"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        {/* Crystal Sanctuary Header */}
        <div className="text-center mb-6">
          <div className="relative w-20 h-20 mx-auto mb-3">
            <div className={`w-full h-full rounded-3xl flex items-center justify-center text-4xl border-2 transition-all duration-300 ${
              isComplete
                ? 'bg-cyan-100 border-cyan-400 shadow-[0_6px_0_0_#0891b2] animate-bounce'
                : 'bg-cyan-50 border-cyan-200 text-cyan-800 shadow-[0_4px_0_0_#a5f3fc]'
            }`}>
              💎
            </div>
            {isComplete && (
              <span className="absolute -top-1 -right-1 text-2xl animate-spin">✨</span>
            )}
          </div>

          <h3 className="font-headline text-xl sm:text-2xl font-black text-on-surface">
            {lang === 'en' ? 'Sacred Time Crystal Chamber' : 'Қасиетті Уақыт Кристалы'}
          </h3>
          <p className="font-headline text-xs font-bold text-cyan-800 bg-cyan-50 inline-block px-3 py-1 rounded-full border border-cyan-200 mt-1">
            {lang === 'en'
              ? `${collected.length} of ${total} Fragments Recovered`
              : `${collected.length} / ${total} Кристалл Сынығы Жиналды`}
          </p>
        </div>

        {/* 10 Fragments Ring / Grid */}
        <div className="grid grid-cols-5 gap-2.5 mb-6">
          {DESTINATIONS.map((d) => {
            const hasFragment = collected.includes(d.id);

            return (
              <div
                key={d.id}
                className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
                  hasFragment
                    ? 'bg-cyan-50 border-cyan-400 text-cyan-900 shadow-[0_3px_0_0_#a5f3fc]'
                    : 'bg-surface-container-low border-surface-container opacity-50 text-on-surface-variant'
                }`}
              >
                <div className="text-xl mb-1">{hasFragment ? '💎' : '⚪'}</div>
                <div className="text-[10px] font-mono font-black">#{d.num}</div>
              </div>
            );
          })}
        </div>

        {/* Progress status or restoration button */}
        {isComplete ? (
          <div className="text-center animate-fadeIn">
            <div className="bg-primary/10 border-2 border-primary/30 p-4 rounded-2xl mb-4 text-xs font-headline font-bold text-primary leading-relaxed">
              🎉 {lang === 'en'
                ? 'All 10 ancient fragments are assembled! The crystal resonates with radiant steppe power!'
                : 'Барлық 10 тарихи сынық түгелденді! Кристалл Ұлы Даланың мәңгілік жарығымен жарқырап тұр!'}
            </div>
            <button
              type="button"
              onClick={handleRestore}
              className="w-full py-4 bg-primary hover:bg-primary-container text-on-primary font-headline font-black rounded-2xl shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-sm"
            >
              {lang === 'en' ? 'Perform Restoration Ceremony (+500 XP)' : 'Кристалды Тұтастау Рәсімі (+500 XP)'}
            </button>
          </div>
        ) : (
          <div className="bg-surface-container-low border border-surface-container p-4 rounded-2xl text-center text-xs font-body text-on-surface-variant font-medium">
            {lang === 'en'
              ? `Collect the remaining ${total - collected.length} fragments across the 10 game modes to restore the crystal!`
              : `Кристалды толық қалпына келтіру үшін қалған ${total - collected.length} сынықты тауып алыңыз!`}
          </div>
        )}
      </div>
    </div>
  );
}
