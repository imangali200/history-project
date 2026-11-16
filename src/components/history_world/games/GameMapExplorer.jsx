import React, { useState } from 'react';
import sounds from '../../../utils/audio';
import confetti from 'canvas-confetti';

const MAP_TARGETS = [
  {
    id: 'turkestan',
    name: 'Түркістан (Иасы)',
    nameEn: 'Turkestan (Yasi)',
    desc: 'Қазақ хандығының рухани астанасы, Қожа Ахмет Ясауи кесенесі орналасқан қасиетті шаһар.',
    descEn: 'The spiritual capital of the Kazakh Khanate, home to the sacred Mausoleum of Khoja Ahmed Yasawi.',
    x: 48, // % from left
    y: 62  // % from top
  },
  {
    id: 'otrar',
    name: 'Отырар (Фараб)',
    nameEn: 'Otrar (Farab)',
    desc: 'Ұлы Жібек жолының басты сауда бекеті, әйгілі кітапханасы бар, Әл-Фарабидің туған жері.',
    descEn: 'Major Silk Road trading oasis, birthplace of Al-Farabi and home to the lost imperial library.',
    x: 43,
    y: 68
  },
  {
    id: 'sarayjuk',
    name: 'Сарайшық',
    nameEn: 'Saray-Juk',
    desc: 'Жайық өзені бойындағы Ноғай Ордасы мен Қазақ хандары жерленген тарихи саяси орталық.',
    descEn: 'Historic political metropolis along the Ural river where seven steppe khans were enshrined.',
    x: 20,
    y: 42
  },
  {
    id: 'sygnak',
    name: 'Сығанақ',
    nameEn: 'Sygnak',
    desc: 'Сырдария бойындағы Қыпшақ бірлестігі мен ерте Қазақ хандығының маңызды астанасы.',
    descEn: 'Flourishing ancient capital of the Kipchak confederation and early Kazakh Khanate stronghold on Syr Darya.',
    x: 52,
    y: 56
  }
];

export default function GameMapExplorer({ onComplete, onExit, lang = 'kk' }) {
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [foundLocations, setFoundLocations] = useState([]);
  const [wrongClick, setWrongClick] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentTarget = MAP_TARGETS[currentTargetIndex];

  const handlePinClick = (location) => {
    if (foundLocations.includes(location.id)) return;

    if (location.id === currentTarget.id) {
      sounds.playTileMatch?.();
      const updated = [...foundLocations, location.id];
      setFoundLocations(updated);
      setWrongClick(false);

      if (updated.length >= MAP_TARGETS.length) {
        sounds.playFanfare?.();
        setIsCompleted(true);
        confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
      } else {
        setCurrentTargetIndex(prev => prev + 1);
      }
    } else {
      sounds.playWrong?.();
      setWrongClick(true);
      setTimeout(() => setWrongClick(false), 800);
    }
  };

  if (isCompleted) {
    return (
      <div className="bg-surface-container-lowest border-2 border-surface-container shadow-[0_8px_0_0_#dcdad2] rounded-3xl p-6 sm:p-10 text-on-surface text-center max-w-2xl mx-auto animate-popIn">
        <div className="w-20 h-20 mx-auto rounded-full bg-cyan-100 border-2 border-cyan-300 flex items-center justify-center text-4xl mb-4 shadow-[0_4px_0_0_#a5f3fc]">
          🧭
        </div>
        <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-800 font-headline font-black text-xs rounded-full border border-cyan-200 mb-2">
          {lang === 'en' ? 'FRAGMENT #5 RESTORED' : '5-ШІ СЫНЫҚ ТАБЫЛДЫ'}
        </span>
        <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface mb-2">
          {lang === 'en' ? 'Steppe Cartography Restored!' : 'Ұлы Дала Картасы Қалпына Келтірілді!'}
        </h2>
        <p className="font-body text-on-surface-variant text-xs sm:text-sm max-w-md mx-auto mb-6">
          {lang === 'en'
            ? 'You charted the critical cities of the Silk Road and recovered the Earth Navigation Fragment along with the ancient Astrolabe!'
            : 'Сіз Ұлы Жібек жолының қасиетті шаһарларын дәл тауып, Жер Түйіні Кристалы мен Көне Астролябияны иелендіңіз!'}
        </p>

        {/* Artifact Showcase */}
        <div className="bg-cyan-50/60 border-2 border-cyan-200 rounded-2xl p-4 mb-6 flex items-center gap-4 text-left max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-cyan-100 border border-cyan-300 flex items-center justify-center text-3xl">
            🧭
          </div>
          <div>
            <div className="text-[10px] text-cyan-800 font-headline font-black uppercase tracking-wider">
              {lang === 'en' ? 'Sacred Navigation Tool' : 'Көне Навигация Құралы'}
            </div>
            <div className="font-headline text-base font-black text-on-surface">
              {lang === 'en' ? 'Silk Road Astrolabe' : 'Ұлы Жібек Жолының Астролябиясы'}
            </div>
            <div className="text-xs text-on-surface-variant font-medium">
              {lang === 'en' ? '+170 XP • +85 Time Coins' : '+170 XP • +85 Уақыт Монетасы'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onComplete(5)}
          className="w-full max-w-xs py-3.5 bg-primary hover:bg-primary-container text-on-primary font-headline font-black rounded-2xl shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-base"
        >
          {lang === 'en' ? 'Return to World Map' : 'Әлем Картасына Қайту'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border-2 border-surface-container shadow-[0_8px_0_0_#dcdad2] rounded-3xl p-6 sm:p-8 text-on-surface">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 border-b border-surface-container pb-4">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-headline font-bold cursor-pointer transition-all shadow-[0_2px_0_0_#dcdad2]"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          {lang === 'en' ? 'Exit Map' : 'Картаға қайту'}
        </button>
        <div className="text-xs font-headline font-black text-cyan-800 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-200">
          {foundLocations.length} / {MAP_TARGETS.length} {lang === 'en' ? 'Restored' : 'Ашылды'}
        </div>
      </div>

      {/* Target Mission Prompt */}
      {currentTarget && (
        <div className={`p-4 rounded-2xl mb-5 border-2 transition-all ${
          wrongClick
            ? 'bg-red-50 border-red-400 animate-shake'
            : 'bg-cyan-50/70 border-cyan-200 shadow-sm'
        }`}>
          <div className="text-[11px] font-headline font-black text-cyan-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">near_me</span>
            {lang === 'en' ? 'TARGET MISSION: LOCATE THIS CITY' : 'ТАПСЫРМА: КЕЛЕСІ ҚАЛАНЫ КАРТАДАН БЕЛГІЛЕҢІЗ'}
          </div>
          <h3 className="font-headline text-base font-black text-on-surface mb-1">
            {lang === 'en' ? currentTarget.nameEn : currentTarget.name}
          </h3>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            {lang === 'en' ? currentTarget.descEn : currentTarget.desc}
          </p>
        </div>
      )}

      {/* Interactive Cartographic Steppe Canvas */}
      <div className="relative w-full aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden border-2 border-amber-300 bg-[#fbf5e5] p-4 shadow-inner">
        {/* Subtle Steppe Map Grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#b45309_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Caspian Sea Silhouette */}
        <div className="absolute left-2 bottom-8 w-28 h-48 rounded-full bg-sky-200/60 blur-sm pointer-events-none border border-sky-300/40" />
        <div className="absolute left-4 bottom-20 text-[10px] text-sky-800 font-headline font-black uppercase tracking-widest pointer-events-none">
          {lang === 'en' ? 'Caspian Sea' : 'Каспий Теңізі'}
        </div>

        {/* Aral Sea & Syr Darya trace */}
        <div className="absolute left-[38%] top-[45%] text-[10px] text-amber-800/80 font-headline font-black uppercase tracking-widest pointer-events-none">
          {lang === 'en' ? 'Aral Sea • Syr Darya' : 'Арал • Сырдария'}
        </div>

        {/* Silk Road Path dashed line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 120 180 Q 280 200, 420 280 T 650 320"
            fill="none"
            stroke="#d97706"
            strokeWidth="3"
            strokeDasharray="6,6"
            opacity="0.5"
          />
        </svg>

        {/* Clickable Map Pins */}
        {MAP_TARGETS.map((loc) => {
          const isFound = foundLocations.includes(loc.id);

          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => handlePinClick(loc)}
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full cursor-pointer transition-all duration-200 group z-10 ${
                isFound
                  ? 'bg-primary text-on-primary scale-110 shadow-[0_3px_0_0_#337801]'
                  : 'bg-white hover:bg-amber-100 text-amber-800 border-2 border-amber-400 shadow-[0_3px_0_0_#d97706] hover:scale-125'
              }`}
            >
              <span className="material-symbols-outlined text-base block material-symbols-filled">
                {isFound ? 'flag' : 'location_on'}
              </span>

              {/* Pin Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block whitespace-nowrap bg-on-surface text-surface-container-lowest text-[11px] font-headline font-black px-2.5 py-1 rounded-xl shadow-lg pointer-events-none z-20">
                {isFound ? (lang === 'en' ? loc.nameEn : loc.name) : (lang === 'en' ? 'Click to identify' : 'Қаланы тексеру')}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-center text-xs font-body text-on-surface-variant font-medium">
        💡 {lang === 'en' ? 'Click the navigation pins across the ancient steppe map.' : 'Карта бетіндегі белгілерді басып, қаланың орнын анықтаңыз.'}
      </div>
    </div>
  );
}
