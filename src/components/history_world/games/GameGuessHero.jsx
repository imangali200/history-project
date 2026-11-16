import React, { useState } from 'react';
import sounds from '../../../utils/audio';
import confetti from 'canvas-confetti';

const HEROES_DATA = [
  {
    id: 'alfarabi',
    name: 'Әбу Насыр Әл-Фараби',
    nameEn: 'Abu Nasr Al-Farabi',
    title: '«Екінші Ұстаз» (Аристотельден кейінгі)',
    titleEn: 'The Second Teacher of the World',
    emoji: '📜',
    clues: [
      { text: 'Отырар (Фараб) қаласында туып, Шығыс пен Батыс ғылымының шамшырағы болған ғұлама.', textEn: 'Born in ancient Otrar (Farab), enlightened world philosophy and sciences.' },
      { text: 'Аристотельдің еңбектерін терең талдап, әлемге «Екінші Ұстаз» деген ұлы атақпен танылды.', textEn: 'Renowned globally as the "Second Master" after Aristotle.' },
      { text: '«Қайырымды қала тұрғындарының көзқарасы» атты әлеуметтік-философиялық атақты трактат жазды.', textEn: 'Penned the monumental political philosophy treatise "The Virtuous City".' },
      { text: 'Музыка теориясын ғылыми тұрғыда жүйелеп, қыпшақ даласының даналығын күллі әлемге таратты.', textEn: 'Invented musical notation systems and bridged nomadic Steppe thought with world science.' }
    ],
    funFact: 'Әл-Фараби 70-тен астам тіл білген және математика, астрономия, логика саласында 160-қа жуық трактат жазған.'
  },
  {
    id: 'abylai',
    name: 'Абылай Хан',
    nameEn: 'Abylai Khan',
    title: 'Үш Жүздің Басын Қосқан Ұлы Хан',
    titleEn: 'Uniter of the Three Hordes',
    emoji: '🦅',
    clues: [
      { text: 'Жас кезінде «Сабалақ» атанған, кейін қазақ қолының бас сардары болған батыр.', textEn: 'Known in youth by the pseudonym "Sabalaq", later became supreme commander.' },
      { text: 'Қазақ елінің тәуелсіздігі үшін Ресей мен Қытай империялары арасында аса шебер теңгермелі саясат жүргізді.', textEn: 'Masterfully balanced geopolitical diplomacy between Russian and Qing empires.' },
      { text: '1771 жылы Түркістанда үш жүздің ханы болып ақ киізге көтерілді.', textEn: 'Enthroned on white felt as supreme Khan of all three Kazakh hordes in Turkestan (1771).' },
      { text: 'Аңырақай шайқасында жоңғардың бас батыры Шарышты жекпе-жекте жеңіп, ерлік көрсетті.', textEn: 'Defeated Dzungar warlord Sharysh in legendary single combat at Anyrakai.' }
    ],
    funFact: 'Абылай хан көреген дипломатиясы мен қайтпас қайсарлығының арқасында қазақ жерінің тұтастығын сақтап қалды.'
  }
];

export default function GameGuessHero({ onComplete, onExit, lang = 'kk' }) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [revealedClues, setRevealedClues] = useState(1);
  const [selectedHero, setSelectedHero] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const hero = HEROES_DATA[heroIndex];

  const handleRevealNextClue = () => {
    sounds.playTap?.();
    if (revealedClues < hero.clues.length) {
      setRevealedClues(prev => prev + 1);
    }
  };

  const handleGuess = (heroId) => {
    setSelectedHero(heroId);
    if (heroId === hero.id) {
      sounds.playCorrect?.();
      sounds.playFanfare?.();
      setIsRevealed(true);
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    } else {
      sounds.playWrong?.();
    }
  };

  if (isRevealed) {
    return (
      <div className="bg-surface-container-lowest border-2 border-surface-container shadow-[0_8px_0_0_#dcdad2] rounded-3xl p-6 sm:p-10 text-on-surface text-center max-w-2xl mx-auto animate-popIn">
        <div className="w-20 h-20 mx-auto rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center text-4xl mb-4 shadow-[0_4px_0_0_#d8b4fe]">
          {hero.emoji}
        </div>
        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 font-headline font-black text-xs rounded-full border border-purple-200 mb-2">
          {lang === 'en' ? 'FRAGMENT #4 UNLOCKED' : '4-ШІ СЫНЫҚ БОСАТЫЛДЫ'}
        </span>
        <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface mb-1">
          {lang === 'en' ? hero.nameEn : hero.name}
        </h2>
        <div className="text-xs text-on-surface-variant mb-5 font-headline font-bold">
          {lang === 'en' ? hero.titleEn : hero.title}
        </div>

        {/* Fact Card */}
        <div className="bg-purple-50/60 border-2 border-purple-200 rounded-2xl p-4 mb-6 text-xs text-on-surface-variant leading-relaxed text-left max-w-md mx-auto shadow-sm">
          <span className="font-headline font-black text-purple-800 block mb-1">💡 {lang === 'en' ? 'HISTORICAL LEGACY:' : 'ТАРИХИ МҰРА:'}</span>
          {hero.funFact}
        </div>

        {/* Artifact Showcase */}
        <div className="bg-surface-container-low border border-surface-container rounded-2xl p-4 mb-6 flex items-center gap-4 text-left max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-3xl">
            📜
          </div>
          <div>
            <div className="text-[10px] text-purple-800 font-headline font-black uppercase tracking-wider">
              {lang === 'en' ? 'New Sacred Artifact' : 'Жаңа Қасиетті Жәдігер'}
            </div>
            <div className="font-headline text-base font-black text-on-surface">
              {lang === 'en' ? 'Al-Farabi Rare Manuscript' : 'Әл-Фарабидің «Қайырымды қала» қолжазбасы'}
            </div>
            <div className="text-xs text-on-surface-variant font-medium">
              {lang === 'en' ? '+150 XP • +75 Time Coins' : '+150 XP • +75 Уақыт Монетасы'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onComplete(4)}
          className="w-full max-w-xs py-3.5 bg-primary hover:bg-primary-container text-on-primary font-headline font-black rounded-2xl shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-base"
        >
          {lang === 'en' ? 'Collect Wisdom & Return' : 'Жүлдені Алып Картаға Қайту'}
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
          {lang === 'en' ? 'Exit Hall' : 'Картаға қайту'}
        </button>
        <div className="text-xs font-headline font-black text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm material-symbols-filled">theater_comedy</span>
          {lang === 'en' ? 'Hall of Heroes' : 'Ұлы Тұлғалар Залы'}
        </div>
      </div>

      {/* Silhouette Stage */}
      <div className="text-center mb-6">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-50 border-2 border-amber-300 flex items-center justify-center mb-3 shadow-[0_4px_0_0_#fde68a]">
          <span className="text-5xl filter brightness-50 contrast-200 opacity-60">
            👤
          </span>
        </div>
        <div className="text-xs font-headline font-black text-primary uppercase tracking-wider">
          {lang === 'en' ? 'Mystery Steppe Personality' : 'Көлеңкедегі Ұлы Тұлға'}
        </div>
        <p className="font-body text-xs text-on-surface-variant max-w-sm mx-auto mt-1">
          {lang === 'en'
            ? 'Unlock clues step-by-step to deduct the true identity of this great thinker or leader.'
            : 'Құпия деректерді біртіндеп ашып, көлеңкедегі ұлы тұлғаны табыңыз.'}
        </p>
      </div>

      {/* Clues Box */}
      <div className="space-y-3 mb-6">
        {hero.clues.map((clue, idx) => {
          const isRevealedClue = idx < revealedClues;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border-2 transition-all ${
                isRevealedClue
                  ? 'bg-purple-50/50 border-purple-200 text-on-surface shadow-[0_2px_0_0_#e9d5ff] animate-slideInRight'
                  : 'bg-surface-container-low border-surface-container opacity-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-headline font-black ${isRevealedClue ? 'text-purple-800' : 'text-on-surface-variant'}`}>
                  {lang === 'en' ? `Clue #${idx + 1}:` : `№${idx + 1} Құпия Дерек:`}
                </span>
                {!isRevealedClue && (
                  <span className="material-symbols-outlined text-xs text-on-surface-variant">lock</span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-body leading-relaxed">
                {isRevealedClue ? (lang === 'en' ? clue.textEn : clue.text) : '•••••••••••••••••••••••••••••••••••••••••••••'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Reveal More Clues Button */}
      {revealedClues < hero.clues.length && (
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={handleRevealNextClue}
            className="px-5 py-2.5 rounded-2xl bg-surface-container hover:bg-surface-container-high border-2 border-surface-container-high text-on-surface text-xs font-headline font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_2px_0_0_#dcdad2] active:translate-y-0.5 active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined text-sm">lock_open</span>
            {lang === 'en' ? 'Reveal Next Clue' : 'Келесі құпия деректі ашу'}
          </button>
        </div>
      )}

      {/* Guessing Options */}
      <div className="bg-surface-container-low border border-surface-container rounded-2xl p-5">
        <div className="font-headline text-sm font-black text-on-surface mb-3">
          {lang === 'en' ? 'Who is this historic personality?' : 'Бұл тарихи тұлға кім?'}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: 'alfarabi', name: 'Әбу Насыр Әл-Фараби', nameEn: 'Abu Nasr Al-Farabi' },
            { id: 'abylai', name: 'Абылай Хан', nameEn: 'Abylai Khan' },
            { id: 'kasym', name: 'Қасым Хан', nameEn: 'Kasym Khan' },
            { id: 'kultegin', name: 'Күлтегін Батыр', nameEn: 'Kultegin Hero' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleGuess(item.id)}
              className={`p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-headline font-bold transition-all cursor-pointer flex items-center justify-between ${
                selectedHero === item.id && item.id !== hero.id
                  ? 'bg-red-50 border-red-500 text-red-700 shadow-[0_3px_0_0_#b91c1c]'
                  : 'bg-surface-container-lowest border-surface-container hover:border-primary text-on-surface shadow-[0_3px_0_0_#dcdad2]'
              }`}
            >
              <span>{lang === 'en' ? item.nameEn : item.name}</span>
              <span className="material-symbols-outlined text-sm">done</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
