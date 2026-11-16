import React from 'react';
import { AVATAR_OPTIONS } from './historyWorldData';
import sounds from '../../utils/audio';

export default function AvatarCustomizerModal({
  isOpen,
  onClose,
  gameState,
  onSelectAvatar,
  lang = 'kk'
}) {
  if (!isOpen) return null;

  const handleSelect = (avatar) => {
    sounds.playTap?.();
    if (!avatar.unlocked && gameState.coins < (avatar.reqCoins || 0)) {
      sounds.playWrong?.();
      return;
    }
    onSelectAvatar(avatar);
  };

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

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="font-headline text-xl font-black text-on-surface">
            {lang === 'en' ? 'Steppe Explorer Persona' : 'Кейіпкер мен Дәреже Таңдау'}
          </h3>
          <p className="font-body text-xs text-on-surface-variant mt-1">
            {lang === 'en'
              ? 'Select your historical appearance and steppe identity'
              : 'Тарихи кейіпкеріңіз бен дәрежеңізді таңдаңыз'}
          </p>
        </div>

        {/* Avatars List */}
        <div className="space-y-3 mb-6">
          {AVATAR_OPTIONS.map((av) => {
            const isSelected = gameState.avatar === av.id;
            const canUnlock = av.unlocked || gameState.coins >= (av.reqCoins || 0);

            return (
              <button
                key={av.id}
                type="button"
                onClick={() => handleSelect(av)}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary/10 border-primary shadow-[0_4px_0_0_#337801]'
                    : 'bg-surface-container-lowest border-surface-container hover:border-primary/40 shadow-[0_3px_0_0_#dcdad2]'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-surface-container border border-surface-container-high flex items-center justify-center text-3xl shrink-0 shadow-sm">
                  {av.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-sm font-black text-on-surface">
                      {lang === 'en' ? av.nameEn : av.name}
                    </span>
                    <span className="text-[11px] font-headline font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {av.badge}
                    </span>
                  </div>
                  {!av.unlocked && (
                    <span className="text-xs font-mono font-bold text-amber-700 mt-0.5 block">
                      🪙 {av.reqCoins} {lang === 'en' ? 'Time Coins to unlock' : 'монета қажет'}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-primary text-xl material-symbols-filled shrink-0">
                    check_circle
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            sounds.playTap?.();
            onClose();
          }}
          className="w-full py-3.5 bg-primary hover:bg-primary-container text-on-primary font-headline font-black rounded-2xl shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-sm"
        >
          {lang === 'en' ? 'Confirm Selection' : 'Таңдауды Бекіту'}
        </button>
      </div>
    </div>
  );
}
