import React from 'react';
import { TIME_KEEPER_LORE } from './historyWorldData';
import sounds from '../../utils/audio';

export default function TimeKeeperModal({ isOpen, onClose, lang = 'kk' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-surface-container-lowest border-2 border-surface-container shadow-[0_12px_40px_rgba(0,0,0,0.2)] p-6 sm:p-8 text-on-surface animate-popIn">
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

        {/* Time Keeper Character Profile */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl mb-3 shadow-[0_4px_0_0_#fde68a]">
            {TIME_KEEPER_LORE.avatar}
          </div>
          <h3 className="font-headline text-xl font-black text-on-surface">
            {lang === 'en' ? TIME_KEEPER_LORE.nameEn : TIME_KEEPER_LORE.name}
          </h3>
          <p className="font-headline text-xs font-bold text-primary uppercase tracking-wider mt-0.5">
            {lang === 'en' ? TIME_KEEPER_LORE.roleEn : TIME_KEEPER_LORE.role}
          </p>
        </div>

        {/* Lore Dialogue Box */}
        <div className="bg-surface-container-low border border-surface-container rounded-2xl p-5 mb-6 text-on-surface text-xs sm:text-sm leading-relaxed font-serif relative">
          <span className="text-3xl text-amber-500/40 font-serif absolute -top-2 left-3 select-none">“</span>
          <p className="pt-2">
            {lang === 'en' ? TIME_KEEPER_LORE.introStory.en : TIME_KEEPER_LORE.introStory.kk}
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playTap?.();
            onClose();
          }}
          className="w-full py-3.5 bg-primary hover:bg-primary-container text-on-primary font-headline font-black rounded-2xl shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-sm"
        >
          {lang === 'en' ? 'I Am Ready to Venture!' : 'Мен Саяхатқа Дайынмын! 🚀'}
        </button>
      </div>
    </div>
  );
}
