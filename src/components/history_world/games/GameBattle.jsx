import React, { useState } from 'react';
import sounds from '../../../utils/audio';
import confetti from 'canvas-confetti';

const BATTLE_QUESTIONS = [
  {
    q: '1729 жылы қазақ жасақтары жоңғар басқыншыларына күйрете соққы берген ұлы шайқас:',
    qEn: 'In 1729, the united Kazakh warriors decisively crushed Dzungar invaders in which historic battle?',
    options: [
      { text: 'Аңырақай шайқасы', textEn: 'Battle of Anyrakai', correct: true },
      { text: 'Орбұлақ шайқасы', textEn: 'Battle of Orbulak', correct: false },
      { text: 'Бұланты шайқасы', textEn: 'Battle of Bulanty', correct: false },
      { text: 'Қатаған қырғыны', textEn: 'Katagan Conflict', correct: false }
    ]
  },
  {
    q: '1643 жылы Жәңгір хан 600 сарбазымен жоңғардың 50 мыңдық қалың қолына төтеп берген шайқас:',
    qEn: 'In 1643, Salqam Zhangir Khan with 600 brave warriors defended against 50,000 Dzungars at:',
    options: [
      { text: 'Орбұлақ шайқасы', textEn: 'Battle of Orbulak', correct: true },
      { text: 'Атлах шайқасы', textEn: 'Battle of Atlakh', correct: false },
      { text: 'Күлік шайқасы', textEn: 'Battle of Kulik', correct: false },
      { text: 'Аңырақай шайқасы', textEn: 'Battle of Anyrakai', correct: false }
    ]
  },
  {
    q: 'Қазақ хандығының аумағын барынша кеңейтіп, миллионнан астам халықты біріктірген «Қасқа жолдың» иесі кім?',
    qEn: 'Which legendary Khan expanded the Khanate territory to its zenith, uniting over one million nomads under his "Bright Road"?',
    options: [
      { text: 'Қасым хан', textEn: 'Kasym Khan', correct: true },
      { text: 'Тәуке хан', textEn: 'Tauke Khan', correct: false },
      { text: 'Есім хан', textEn: 'Esim Khan', correct: false },
      { text: 'Кенесары хан', textEn: 'Kenesary Khan', correct: false }
    ]
  },
  {
    q: '«Жеті Жарғы» заңдар жинағын қабылдаған дала реформаторы ұлы хан:',
    qEn: 'Which wise Kazakh ruler formulated and ratified the renowned "Zheti Zhargy" legal code?',
    options: [
      { text: 'Тәуке хан', textEn: 'Tauke Khan', correct: true },
      { text: 'Абылай хан', textEn: 'Abylai Khan', correct: false },
      { text: 'Хақназар хан', textEn: 'Haqnazar Khan', correct: false },
      { text: 'Шығай хан', textEn: 'Shygai Khan', correct: false }
    ]
  }
];

export default function GameBattle({ onComplete, onExit, lang = 'kk' }) {
  const [playerHp, setPlayerHp] = useState(100);
  const [bossHp, setBossHp] = useState(100);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [battleLog, setBattleLog] = useState([
    lang === 'en'
      ? 'Shadow Guardian has challenged your historical intellect!'
      : 'Қара Түнек Күзетшісі сізді тарихи сайысқа шақырды!'
  ]);

  // Abilities
  const [doubleStrikeActive, setDoubleStrikeActive] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [animatingAttack, setAnimatingAttack] = useState(null);

  const currentQ = BATTLE_QUESTIONS[currentQIndex];

  const handleUseDoubleStrike = () => {
    if (doubleStrikeActive) return;
    sounds.playTap?.();
    setDoubleStrikeActive(true);
    setBattleLog(prev => [
      lang === 'en' ? '⚡ Double Strike activated! Next hit deals 2x damage!' : '⚡ Қос соққы қосылды! Келесі соққы 2 есе ауыр тиеді!',
      ...prev
    ]);
  };

  const handleUseShield = () => {
    if (shieldActive) return;
    sounds.playTap?.();
    setShieldActive(true);
    setBattleLog(prev => [
      lang === 'en' ? '🛡️ Shield activated! Protected against next blunder!' : '🛡️ Қалқан іске қосылды! Келесі қате соққысын кері қайтарады!',
      ...prev
    ]);
  };

  const handleUseHint = () => {
    if (usedHint) return;
    sounds.playTap?.();
    setUsedHint(true);
    const wrongIndices = currentQ.options
      .map((opt, i) => (!opt.correct ? i : null))
      .filter(i => i !== null);
    setHiddenOptions(wrongIndices.slice(0, 2));
    setBattleLog(prev => [
      lang === 'en' ? '💡 Historical Hint! 2 incorrect answers removed!' : '💡 Тарихи кеңес! 2 қате жауап өшірілді!',
      ...prev
    ]);
  };

  const handleAnswer = (option) => {
    if (animatingAttack) return;

    if (option.correct) {
      sounds.playCorrect?.();
      setAnimatingAttack('player');
      const dmg = doubleStrikeActive ? 70 : 35;
      const newBossHp = Math.max(0, bossHp - dmg);
      setBossHp(newBossHp);
      setDoubleStrikeActive(false);

      setBattleLog(prev => [
        lang === 'en'
          ? `⚔️ Direct hit! You dealt ${dmg} DMG with historical truth!`
          : `⚔️ Дөп тиді! Сіз тарихи шындықпен ${dmg} нүкте соққы бердіңіз!`,
        ...prev
      ]);

      setTimeout(() => {
        setAnimatingAttack(null);
        if (newBossHp <= 0) {
          sounds.playFanfare?.();
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else {
          setHiddenOptions([]);
          setCurrentQIndex(prev => (prev + 1) % BATTLE_QUESTIONS.length);
        }
      }, 700);

    } else {
      sounds.playWrong?.();
      setAnimatingAttack('boss');

      if (shieldActive) {
        setShieldActive(false);
        setBattleLog(prev => [
          lang === 'en' ? '🛡️ Your shield blocked the dark attack!' : '🛡️ Сіздің қалқаныңыз қара түнек соққысын тойтарды!',
          ...prev
        ]);
        setTimeout(() => setAnimatingAttack(null), 500);
      } else {
        const newPlayerHp = Math.max(0, playerHp - 25);
        setPlayerHp(newPlayerHp);
        setBattleLog(prev => [
          lang === 'en' ? '💥 Boss struck back for 25 damage!' : '💥 Күзетші қарымта соққы жасап, 25 ұпай шығын келтірді!',
          ...prev
        ]);
        setTimeout(() => {
          setAnimatingAttack(null);
        }, 600);
      }
    }
  };

  // Victory Screen
  if (bossHp <= 0) {
    return (
      <div className="bg-surface-container-lowest border-2 border-surface-container shadow-[0_8px_0_0_#dcdad2] rounded-3xl p-6 sm:p-10 text-on-surface text-center max-w-2xl mx-auto animate-popIn">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-100 border-2 border-red-300 flex items-center justify-center text-4xl mb-4 shadow-[0_4px_0_0_#fca5a5]">
          ⚔️
        </div>
        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 font-headline font-black text-xs rounded-full border border-red-200 mb-2">
          {lang === 'en' ? 'FRAGMENT #3 WON IN BATTLE' : '3-ШІ СЫНЫҚ ШАЙҚАСТА ЖЕҢІП АЛЫНДЫ'}
        </span>
        <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface mb-2">
          {lang === 'en' ? 'Shadow Guardian Defeated!' : 'Батырлар Шайқасында Ұлы Жеңіс!'}
        </h2>
        <p className="font-body text-on-surface-variant text-xs sm:text-sm max-w-md mx-auto mb-6">
          {lang === 'en'
            ? 'Your unshakable command of steppe military history triumphed over darkness! Courage Fragment and Abylai Khan’s Sword recovered!'
            : 'Сіз Ұлы Даланың жауынгерлік тарихын терең меңгеріп, Ерлік Жарығы мен Абылай ханның Ақ Орда Қылышына ие болдыңыз!'}
        </p>

        {/* Artifact Showcase */}
        <div className="bg-red-50/60 border-2 border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-4 text-left max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center text-3xl">
            ⚔️
          </div>
          <div>
            <div className="text-[10px] text-red-800 font-headline font-black uppercase tracking-wider">
              {lang === 'en' ? 'Legendary Weapon Artifact' : 'Аты Аңызға Айналған Қару'}
            </div>
            <div className="font-headline text-base font-black text-on-surface">
              {lang === 'en' ? 'Sword of Abylai Khan' : 'Абылай Ханның Ақ Орда Қылышы'}
            </div>
            <div className="text-xs text-on-surface-variant font-medium">
              {lang === 'en' ? '+180 XP • +100 Time Coins' : '+180 XP • +100 Уақыт Монетасы'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onComplete(3)}
          className="w-full max-w-xs py-3.5 bg-primary hover:bg-primary-container text-on-primary font-headline font-black rounded-2xl shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-base"
        >
          {lang === 'en' ? 'Seize Victory & Return' : 'Жүлдені Алып Картаға Қайту'}
        </button>
      </div>
    );
  }

  // Defeat Screen
  if (playerHp <= 0) {
    return (
      <div className="bg-surface-container-lowest border-2 border-red-200 shadow-[0_8px_0_0_#fca5a5] p-8 rounded-3xl text-center max-w-lg mx-auto">
        <div className="text-5xl mb-3">💀</div>
        <h3 className="font-headline text-xl font-black text-red-600 mb-2">
          {lang === 'en' ? 'Defeat in Arena' : 'Аренада Жеңіліс'}
        </h3>
        <p className="font-body text-xs text-on-surface-variant mb-6">
          {lang === 'en' ? 'The dark guardian overwhelmed you. Re-arm your knowledge and try again!' : 'Қара түнек күштері басым түсті. Біліміңізді шыңдап, қайта сайысыңыз!'}
        </p>
        <button
          type="button"
          onClick={() => {
            setPlayerHp(100);
            setBossHp(100);
            setBattleLog([]);
          }}
          className="px-6 py-3 bg-primary hover:bg-primary-container font-headline font-black rounded-2xl text-on-primary shadow-[0_4px_0_0_#337801] cursor-pointer"
        >
          {lang === 'en' ? 'Try Battle Again' : 'Қайта Шайқасу'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border-2 border-surface-container shadow-[0_8px_0_0_#dcdad2] rounded-3xl p-6 sm:p-8 text-on-surface">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 border-b border-surface-container pb-4">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-headline font-bold cursor-pointer transition-all shadow-[0_2px_0_0_#dcdad2]"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          {lang === 'en' ? 'Retreat from Arena' : 'Картаға қайту'}
        </button>

        <div className="text-xs font-headline font-black text-red-700 bg-red-100 px-3 py-1 rounded-full border border-red-200 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm material-symbols-filled">swords</span>
          {lang === 'en' ? 'Knowledge RPG Duel' : 'Білім Сайсы RPG'}
        </div>
      </div>

      {/* Combatant Stage: Player vs Boss */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Player Card */}
        <div className={`p-4 rounded-2xl border-2 transition-transform ${
          animatingAttack === 'boss'
            ? 'animate-shake border-red-500 bg-red-50'
            : 'bg-primary/5 border-primary/30'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🏹</span>
            <div>
              <div className="text-xs font-headline font-black text-on-surface">
                {lang === 'en' ? 'Time Explorer' : 'Уақыт Саяхатшысы'}
              </div>
              <div className="text-[10px] text-primary font-bold font-mono">HP: {playerHp} / 100</div>
            </div>
          </div>
          {/* HP Bar */}
          <div className="w-full bg-surface-container rounded-full h-3 p-0.5 border border-surface-container-high overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${playerHp}%` }}
            />
          </div>
        </div>

        {/* Boss Card */}
        <div className={`p-4 rounded-2xl border-2 transition-transform ${
          animatingAttack === 'player'
            ? 'animate-shake border-amber-500 bg-amber-50'
            : 'bg-red-50/70 border-red-200'
        }`}>
          <div className="flex items-center justify-end gap-2 mb-2 text-right">
            <div>
              <div className="text-xs font-headline font-black text-on-surface">
                {lang === 'en' ? 'Shadow Guardian' : 'Қара Түнек Күзетшісі'}
              </div>
              <div className="text-[10px] text-red-600 font-bold font-mono">HP: {bossHp} / 100</div>
            </div>
            <span className="text-2xl">👹</span>
          </div>
          {/* Boss HP Bar */}
          <div className="w-full bg-surface-container rounded-full h-3 p-0.5 border border-surface-container-high overflow-hidden">
            <div
              className="bg-red-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${bossHp}%` }}
            />
          </div>
        </div>
      </div>

      {/* Battle Log ticker */}
      <div className="bg-surface-container-low border border-surface-container rounded-xl px-4 py-2.5 mb-5 text-xs text-on-surface-variant flex items-center gap-2 font-mono">
        <span className="text-red-600 font-black">⚔️ LOG:</span>
        <span className="truncate">{battleLog[0]}</span>
      </div>

      {/* Tactical Abilities Bar */}
      <div className="flex flex-wrap items-center gap-2.5 mb-5">
        <button
          type="button"
          onClick={handleUseDoubleStrike}
          disabled={doubleStrikeActive}
          className={`flex-1 py-2.5 px-3 rounded-2xl border-2 text-xs font-headline font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            doubleStrikeActive
              ? 'bg-amber-400 text-stone-950 border-amber-500 font-black shadow-[0_3px_0_0_#d97706]'
              : 'bg-surface-container-lowest border-surface-container hover:border-amber-300 text-on-surface shadow-[0_2px_0_0_#dcdad2]'
          }`}
        >
          <span>⚡</span>
          <span>{lang === 'en' ? 'Double Strike (2x)' : 'Қос соққы (2x)'}</span>
        </button>

        <button
          type="button"
          onClick={handleUseShield}
          disabled={shieldActive}
          className={`flex-1 py-2.5 px-3 rounded-2xl border-2 text-xs font-headline font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            shieldActive
              ? 'bg-sky-400 text-stone-950 border-sky-500 font-black shadow-[0_3px_0_0_#0284c7]'
              : 'bg-surface-container-lowest border-surface-container hover:border-sky-300 text-on-surface shadow-[0_2px_0_0_#dcdad2]'
          }`}
        >
          <span>🛡️</span>
          <span>{lang === 'en' ? 'Shield' : 'Қалқан'}</span>
        </button>

        <button
          type="button"
          onClick={handleUseHint}
          disabled={usedHint}
          className={`flex-1 py-2.5 px-3 rounded-2xl border-2 text-xs font-headline font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            usedHint
              ? 'opacity-40 bg-surface-container border-surface-container cursor-not-allowed'
              : 'bg-surface-container-lowest border-surface-container hover:border-primary/40 text-on-surface shadow-[0_2px_0_0_#dcdad2]'
          }`}
        >
          <span>💡</span>
          <span>{lang === 'en' ? 'Hint (-2 False)' : 'Кеңес (-2 Қате)'}</span>
        </button>
      </div>

      {/* Question / Strike Zone */}
      <div className="bg-surface-container-low border border-surface-container rounded-2xl p-5">
        <div className="text-[11px] font-headline font-black text-red-600 uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          {lang === 'en' ? 'Strike Question:' : 'Шабуыл Сұрағы:'}
        </div>
        <h4 className="font-headline text-base sm:text-lg font-black text-on-surface mb-4">
          {lang === 'en' ? currentQ.qEn : currentQ.q}
        </h4>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentQ.options.map((opt, idx) => {
            if (hiddenOptions.includes(idx)) {
              return (
                <div key={idx} className="p-4 rounded-2xl border-2 border-dashed border-surface-container opacity-30 text-xs flex items-center justify-center">
                  <s>{lang === 'en' ? opt.textEn : opt.text}</s>
                </div>
              );
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleAnswer(opt)}
                className="p-4 rounded-2xl border-2 border-surface-container bg-surface-container-lowest hover:border-primary text-left text-xs sm:text-sm text-on-surface font-headline font-bold cursor-pointer transition-all active:scale-[0.98] shadow-[0_3px_0_0_#dcdad2] flex items-center justify-between"
              >
                <span>{lang === 'en' ? opt.textEn : opt.text}</span>
                <span className="material-symbols-outlined text-sm text-on-surface-variant">touch_app</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
