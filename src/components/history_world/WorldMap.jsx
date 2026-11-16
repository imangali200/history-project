import React from 'react';
import { DESTINATIONS } from './historyWorldData';
import sounds from '../../utils/audio';

export default function WorldMap({
  gameState,
  onSelectDestination,
  lang = 'kk'
}) {
  const handleDestinationClick = (dest) => {
    sounds.playTap?.();
    if (onSelectDestination) {
      onSelectDestination(dest);
    }
  };

  return (
    <div className="relative">
      {/* ━━━━━━━━━━━━━━━━━━━━━ 1. EMERALD & GOLD STEPPE HERO BANNER ━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-[#357c02] to-primary-container border border-primary-container/40 shadow-[0_6px_0_0_#1e5000] p-6 sm:p-8 text-white mb-8">
        {/* Background Light Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-secondary-container/25 blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/15 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-xs font-headline font-black uppercase tracking-wider text-secondary-fixed mb-3">
            <span className="material-symbols-outlined text-sm text-secondary-container material-symbols-filled">
              sports_esports
            </span>
            <span>{lang === 'en' ? 'HISTORY WORLD • 10 REALMS' : 'ТАРИХ ӘЛЕМІ • 10 МЕКЕН'}</span>
          </div>

          <h2 className="font-headline text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white mb-2">
            {lang === 'en' ? 'The 10 Realms of the Time Crystal' : 'Уақыт Кристалының 10 Мекені'} 🗺️
          </h2>

          <p className="font-body text-xs sm:text-sm text-white/95 leading-relaxed font-medium">
            {lang === 'en'
              ? 'Every realm harbors a unique game mechanic, ancient story, and sacred crystal fragment. Embark on all 10 quests to preserve the eternal history of the Great Steppe!'
              : 'Әр мекен өзінің ерекше интерактивті механикасы, тарихи оқиғасы және қасиетті кристалл сынығын сақтап тұр. 10 сынақты түгел ойнап, тарих жадын сақтап қалыңыз!'}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-headline font-bold">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-secondary-fixed border border-white/15">
              <span>💎</span>
              <span>{lang === 'en' ? '10 Fragments to collect' : '10 Кристалл сынығы'}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-white/90 border border-white/15">
              <span>🏺</span>
              <span>{lang === 'en' ? '10 Sacred artifacts' : '10 Қасиетті жәдігер'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━ 2. 10 DESTINATIONS GRID (Duolingo Style 3D Cards) ━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DESTINATIONS.map((dest) => {
          const isCompleted = gameState.collectedFragments?.includes(dest.id);

          return (
            <div
              key={dest.id}
              onClick={() => handleDestinationClick(dest)}
              className={`group relative rounded-3xl p-6 border-2 transition-all duration-200 select-none cursor-pointer flex flex-col justify-between ${
                isCompleted
                  ? 'bg-surface-container-lowest border-primary shadow-[0_6px_0_0_#337801] hover:scale-[1.01]'
                  : 'bg-surface-container-lowest border-surface-container hover:border-primary shadow-[0_6px_0_0_#dcdad2] hover:shadow-[0_6px_0_0_#337801] hover:scale-[1.01]'
              }`}
            >
              <div>
                {/* Top: Number & Subtitle & Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-headline font-black text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-lg border border-surface-container-high">
                      #{dest.num}
                    </span>
                    <span className="text-xs font-headline font-bold text-on-surface-variant">
                      {lang === 'en' ? dest.subtitleEn : dest.subtitle}
                    </span>
                  </div>

                  {isCompleted ? (
                    <div className="flex items-center gap-1 text-[11px] font-headline font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/30">
                      <span className="material-symbols-outlined text-xs material-symbols-filled">verified</span>
                      <span>{lang === 'en' ? 'Completed' : 'Өттіңіз'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] font-headline font-black text-secondary-container bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping" />
                      <span>{lang === 'en' ? 'Playable' : 'Ашық'}</span>
                    </div>
                  )}
                </div>

                {/* Main Content: Icon & Title */}
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 text-amber-800 shadow-sm transition-transform duration-200 group-hover:scale-105">
                    <span className="material-symbols-outlined text-3xl">
                      {dest.icon}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-headline text-lg font-black text-on-surface group-hover:text-primary transition-colors leading-snug">
                      {lang === 'en' ? dest.titleEn : dest.title}
                    </h3>

                    {/* Fragment Name Pill */}
                    <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-[11px] font-headline font-bold text-cyan-800">
                      <span>💎</span>
                      <span>{lang === 'en' ? dest.fragmentNameEn : dest.fragmentName}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-5">
                  {lang === 'en' ? dest.descEn : dest.desc}
                </p>
              </div>

              {/* Bottom: Rewards & Action Button */}
              <div className="pt-4 border-t border-surface-container flex items-center justify-between">
                <div className="flex items-center gap-2 font-headline font-black text-xs text-on-surface-variant">
                  <span className="text-primary font-bold">+{dest.xpReward} XP</span>
                  <span className="text-surface-container-high">•</span>
                  <span className="text-amber-700 font-bold">🪙 {dest.coinReward}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDestinationClick(dest);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-headline font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    isCompleted
                      ? 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-surface-container-high shadow-[0_3px_0_0_#dcdad2] active:translate-y-0.5 active:shadow-none'
                      : 'bg-primary hover:bg-primary-container text-on-primary shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none'
                  }`}
                >
                  <span>
                    {isCompleted
                      ? (lang === 'en' ? 'Play Again' : 'Қайта ойнау')
                      : (lang === 'en' ? 'Start Quest' : 'Саяхатты бастау')}
                  </span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
