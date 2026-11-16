import React from 'react';
import { DESTINATIONS } from './historyWorldData';
import sounds from '../../utils/audio';

export default function ArtifactMuseumModal({ isOpen, onClose, gameState, lang = 'kk' }) {
  if (!isOpen) return null;

  const unlockedArtifacts = gameState.artifacts || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl bg-surface-container-lowest border-2 border-surface-container shadow-[0_12px_40px_rgba(0,0,0,0.2)] p-6 sm:p-8 text-on-surface flex flex-col overflow-hidden animate-popIn">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playTap?.();
            onClose();
          }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center cursor-pointer transition-all z-10"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 shrink-0">
          <div className="w-13 h-13 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-[0_3px_0_0_#fde68a]">
            🏺
          </div>
          <div>
            <h3 className="font-headline text-xl sm:text-2xl font-black text-on-surface">
              {lang === 'en' ? 'Royal Artifact Museum' : 'Қасиетті Жәдігерлер Музейі'}
            </h3>
            <p className="font-headline text-xs font-bold text-amber-800 bg-amber-50 inline-block px-2.5 py-0.5 rounded-full border border-amber-200 mt-0.5">
              {lang === 'en'
                ? `Treasury: ${unlockedArtifacts.length} / ${DESTINATIONS.length} relics discovered`
                : `Қазына: ${unlockedArtifacts.length} / ${DESTINATIONS.length} жәдігер табылды`}
            </p>
          </div>
        </div>

        {/* Artifacts Scrollable Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {DESTINATIONS.map((dest) => {
            const isUnlocked = unlockedArtifacts.includes(dest.id);

            return (
              <div
                key={dest.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-amber-50/50 border-amber-200 shadow-[0_3px_0_0_#fde68a]'
                    : 'bg-surface-container-low border-surface-container opacity-60'
                }`}
              >
                <div className={`w-13 h-13 rounded-2xl flex items-center justify-center text-3xl shrink-0 border-2 ${
                  isUnlocked
                    ? 'bg-amber-100 border-amber-300 shadow-sm'
                    : 'bg-surface-container border-surface-container-high text-on-surface-variant'
                }`}>
                  {isUnlocked ? dest.artifactIcon : '🔒'}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-black text-amber-800">
                      #{dest.num} {lang === 'en' ? 'Relic' : 'Жәдігер'}
                    </span>
                    {isUnlocked && (
                      <span className="text-[10px] font-headline font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                        ✓ {lang === 'en' ? 'Preserved' : 'Музейде'}
                      </span>
                    )}
                  </div>
                  <h4 className="font-headline text-sm font-black text-on-surface truncate mt-0.5">
                    {isUnlocked
                      ? (lang === 'en' ? dest.artifactNameEn : dest.artifactName)
                      : (lang === 'en' ? 'Undiscovered Relic' : 'Белгісіз Жәдігер')}
                  </h4>
                  <p className="font-body text-xs text-on-surface-variant line-clamp-2 mt-1 leading-snug">
                    {isUnlocked
                      ? (lang === 'en' ? `Excavated from "${dest.titleEn}".` : `«${dest.title}» мекенінен табылған қасиетті тарихи мұра.`)
                      : (lang === 'en' ? `Play Mode #${dest.num} to uncover.` : `Табу үшін №${dest.num} ойынды ойнаңыз.`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
