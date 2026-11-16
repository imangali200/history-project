import React, { useState } from 'react';
import sounds from '../../../utils/audio';
import confetti from 'canvas-confetti';

const BUILDINGS = [
  {
    id: 'yurt',
    name: 'Ақ Орда Киіз Үйі',
    nameEn: 'White Palace Yurt',
    emoji: '⛺',
    costWood: 40,
    costGold: 50,
    desc: 'Ханның бас ордасы. Халық саны мен бірлікті арттырады.',
    descEn: 'Supreme royal headquarters, expanding population and tribal allegiance.'
  },
  {
    id: 'forge',
    name: 'Дала Ұстаханасы',
    nameEn: 'Steppe Blacksmith',
    emoji: '🔨',
    costWood: 50,
    costGold: 70,
    desc: 'Қылыш, сауыт және жебе ұштарын соғатын әскери өндіріс.',
    descEn: 'Forges steel sabres, heavy mail armor, and piercing arrowheads.'
  },
  {
    id: 'stables',
    name: 'Тұлпар Атқорасы',
    nameEn: 'Warhorse Stables',
    emoji: '🐎',
    costWood: 40,
    costGold: 60,
    desc: 'Жүйрік қазанаттар мен әскери тұлпарларды баптайтын орын.',
    descEn: 'Breeds and trains agile steppe warhorses for elite cavalry squadrons.'
  },
  {
    id: 'bazaar',
    name: 'Жібек Жолы Базары',
    nameEn: 'Silk Caravan Bazaar',
    emoji: '🏺',
    costWood: 60,
    costGold: 80,
    desc: 'Шығыс пен Батыс керуендерін тоғыстыратын сауда орталығы.',
    descEn: 'Commercial trade hub connecting oriental and western merchants.'
  }
];

export default function GameKingdomBuilder({ onComplete, onExit, lang = 'kk' }) {
  const [resources, setResources] = useState({
    wood: 200,
    gold: 280,
    horses: 40,
    population: 120
  });

  const [builtBuildings, setBuiltBuildings] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleBuild = (b) => {
    if (builtBuildings.includes(b.id)) return;
    if (resources.wood < b.costWood || resources.gold < b.costGold) {
      sounds.playWrong?.();
      return;
    }

    sounds.playTileMatch?.();
    const updatedBuildings = [...builtBuildings, b.id];
    setBuiltBuildings(updatedBuildings);
    setResources(prev => ({
      ...prev,
      wood: prev.wood - b.costWood,
      gold: prev.gold - b.costGold,
      population: prev.population + 50,
      horses: prev.horses + 15
    }));

    if (updatedBuildings.length >= BUILDINGS.length) {
      sounds.playFanfare?.();
      setIsCompleted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  if (isCompleted) {
    return (
      <div className="bg-surface-container-lowest border-2 border-surface-container shadow-[0_8px_0_0_#dcdad2] rounded-3xl p-6 sm:p-10 text-on-surface text-center max-w-2xl mx-auto animate-popIn">
        <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl mb-4 shadow-[0_4px_0_0_#fde68a]">
          🏰
        </div>
        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 font-headline font-black text-xs rounded-full border border-amber-200 mb-2">
          {lang === 'en' ? 'FRAGMENT #9 UNLOCKED' : '9-ШЫ СЫНЫҚ БОСАТЫЛДЫ'}
        </span>
        <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface mb-2">
          {lang === 'en' ? 'Steppe Empire Established!' : 'Ұлы Қазақ Ордасы Бой Көтерді!'}
        </h2>
        <p className="font-body text-on-surface-variant text-xs sm:text-sm max-w-md mx-auto mb-6">
          {lang === 'en'
            ? 'Your nomad civilization thrives with grand pavilions, armories, and trade hubs. You claimed the Prosperity Core and the sacred Yasawi Tayqazan!'
            : 'Сіз Ұлы Орданың инфрақұрылымын толық тұрғызып, Өркендеу Өзегі мен Қожа Ахмет Ясауидің қасиетті Тайқазанына ие болдыңыз!'}
        </p>

        {/* Artifact Showcase */}
        <div className="bg-amber-50/60 border-2 border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-4 text-left max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-3xl">
            🏺
          </div>
          <div>
            <div className="text-[10px] text-amber-800 font-headline font-black uppercase tracking-wider">
              {lang === 'en' ? 'Sacred Steppe Relic' : 'Ұлы Қасиетті Жәдігер'}
            </div>
            <div className="font-headline text-base font-black text-on-surface">
              {lang === 'en' ? 'Sacred Yasawi Tayqazan' : 'Қожа Ахмет Ясауи Тайқазаны'}
            </div>
            <div className="text-xs text-on-surface-variant font-medium">
              {lang === 'en' ? '+220 XP • +130 Time Coins' : '+220 XP • +130 Уақыт Монетасы'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onComplete(9)}
          className="w-full max-w-xs py-3.5 bg-primary hover:bg-primary-container text-on-primary font-headline font-black rounded-2xl shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-base"
        >
          {lang === 'en' ? 'Rule Empire & Return' : 'Жүлдені Алып Картаға Қайту'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border-2 border-surface-container shadow-[0_8px_0_0_#dcdad2] rounded-3xl p-6 sm:p-8 text-on-surface">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5 border-b border-surface-container pb-4">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-headline font-bold cursor-pointer transition-all shadow-[0_2px_0_0_#dcdad2]"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          {lang === 'en' ? 'Leave Empire' : 'Картаға қайту'}
        </button>
        <div className="text-xs font-headline font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
          {builtBuildings.length} / {BUILDINGS.length} {lang === 'en' ? 'Structures Built' : 'Құрылыс Аяқталды'}
        </div>
      </div>

      {/* Resource Inventory Bar */}
      <div className="grid grid-cols-4 gap-3 mb-6 bg-surface-container-low p-4 rounded-2xl border border-surface-container text-center">
        <div>
          <span className="text-2xl block mb-1">🪵</span>
          <div className="font-headline font-black text-amber-800 font-mono text-sm">{resources.wood}</div>
          <div className="text-[11px] font-headline font-bold text-on-surface-variant">{lang === 'en' ? 'Timber' : 'Ағаш'}</div>
        </div>
        <div>
          <span className="text-2xl block mb-1">🪙</span>
          <div className="font-headline font-black text-yellow-700 font-mono text-sm">{resources.gold}</div>
          <div className="text-[11px] font-headline font-bold text-on-surface-variant">{lang === 'en' ? 'Gold' : 'Алтын'}</div>
        </div>
        <div>
          <span className="text-2xl block mb-1">🐎</span>
          <div className="font-headline font-black text-primary font-mono text-sm">{resources.horses}</div>
          <div className="text-[11px] font-headline font-bold text-on-surface-variant">{lang === 'en' ? 'Horses' : 'Тұлпар'}</div>
        </div>
        <div>
          <span className="text-2xl block mb-1">👥</span>
          <div className="font-headline font-black text-teal-700 font-mono text-sm">{resources.population}</div>
          <div className="text-[11px] font-headline font-bold text-on-surface-variant">{lang === 'en' ? 'Nomads' : 'Халық'}</div>
        </div>
      </div>

      {/* Camp Blueprint Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BUILDINGS.map((b) => {
          const isBuilt = builtBuildings.includes(b.id);
          const canAfford = resources.wood >= b.costWood && resources.gold >= b.costGold;

          return (
            <div
              key={b.id}
              className={`p-5 rounded-2xl border-2 transition-all ${
                isBuilt
                  ? 'bg-amber-50/60 border-amber-300 shadow-[0_3px_0_0_#fde68a]'
                  : 'bg-surface-container-lowest border-surface-container hover:border-amber-200 shadow-[0_2px_0_0_#dcdad2]'
              }`}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-13 h-13 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-3xl shrink-0 shadow-sm">
                  {b.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-headline text-base font-black text-on-surface">
                      {lang === 'en' ? b.nameEn : b.name}
                    </h4>
                    {isBuilt && (
                      <span className="text-[10px] font-headline font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                        ✓ {lang === 'en' ? 'Built' : 'Тұрғызылды'}
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-on-surface-variant leading-snug mt-1">
                    {lang === 'en' ? b.descEn : b.desc}
                  </p>
                </div>
              </div>

              {!isBuilt && (
                <div className="flex items-center justify-between pt-3 border-t border-surface-container mt-3">
                  <div className="text-xs font-mono font-bold text-on-surface-variant">
                    🪵 {b.costWood} | 🪙 {b.costGold}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBuild(b)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-xl text-xs font-headline font-black cursor-pointer transition-all ${
                      canAfford
                        ? 'bg-primary hover:bg-primary-container text-on-primary shadow-[0_3px_0_0_#337801] active:translate-y-0.5 active:shadow-none'
                        : 'bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {lang === 'en' ? 'Construct' : 'Тұрғызу'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
