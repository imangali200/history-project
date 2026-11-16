import React, { useState } from 'react';
import sounds from '../../../utils/audio';
import confetti from 'canvas-confetti';

export default function GameEscapeRoom({ onComplete, onExit, lang = 'kk' }) {
  const [chamber, setChamber] = useState(1);
  const [runeAnswer, setRuneAnswer] = useState(null);
  const [starsAligned, setStarsAligned] = useState([false, false, false]);
  const [digits, setDigits] = useState(['1', '0', '0', '0']); // target is 1465
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectRune = (isCorrect) => {
    sounds.playTap?.();
    if (isCorrect) {
      sounds.playCorrect?.();
      setRuneAnswer('correct');
      setTimeout(() => {
        setChamber(2);
      }, 700);
    } else {
      sounds.playWrong?.();
      setRuneAnswer('wrong');
    }
  };

  const toggleStar = (idx) => {
    sounds.playTap?.();
    const updated = [...starsAligned];
    updated[idx] = !updated[idx];
    setStarsAligned(updated);

    if (updated.every(Boolean)) {
      sounds.playCorrect?.();
      setTimeout(() => {
        setChamber(3);
      }, 700);
    }
  };

  const handleDigitChange = (idx, delta) => {
    sounds.playTap?.();
    const updated = [...digits];
    let val = parseInt(updated[idx], 10) + delta;
    if (val > 9) val = 0;
    if (val < 0) val = 9;
    updated[idx] = val.toString();
    setDigits(updated);
  };

  const handleVerifyCode = () => {
    if (digits.join('') === '1465') {
      sounds.playCorrect?.();
      sounds.playFanfare?.();
      setIsCompleted(true);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } else {
      sounds.playWrong?.();
    }
  };

  if (isCompleted) {
    return (
      <div className="bg-surface-container-lowest border-2 border-surface-container shadow-[0_8px_0_0_#dcdad2] rounded-3xl p-6 sm:p-10 text-on-surface text-center max-w-2xl mx-auto animate-popIn">
        <div className="w-20 h-20 mx-auto rounded-full bg-violet-100 border-2 border-violet-300 flex items-center justify-center text-4xl mb-4 shadow-[0_4px_0_0_#c4b5fd]">
          ✨
        </div>
        <span className="inline-block px-3 py-1 bg-violet-100 text-violet-800 font-headline font-black text-xs rounded-full border border-violet-200 mb-2">
          {lang === 'en' ? 'FINAL 10TH FRAGMENT RECOVERED!' : 'СОҢҒЫ 10-ШЫ СЫНЫҚ ТАБЫЛДЫ!'}
        </span>
        <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface mb-2">
          {lang === 'en' ? 'Otrar Vault Escaped!' : 'Отырар Зынданынан Қашу Сәтті Аяқталды!'}
        </h2>
        <p className="font-body text-on-surface-variant text-xs sm:text-sm max-w-md mx-auto mb-6">
          {lang === 'en'
            ? 'You decrypted ancient runes, aligned cosmic constellations, and entered the sacred foundation year 1465. The 10th Eternity Fragment is yours!'
            : 'Сіз көне түрік руналарын шешіп, шоқжұлдыздар сырын ашып, қасиетті 1465 жыл кодын енгіздіңіз. 10-шы Мәңгілік Кристалы босатылды!'}
        </p>

        {/* Artifact Showcase */}
        <div className="bg-violet-50/60 border-2 border-violet-200 rounded-2xl p-4 mb-6 flex items-center gap-4 text-left max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-violet-100 border border-violet-300 flex items-center justify-center text-3xl">
            ✨
          </div>
          <div>
            <div className="text-[10px] text-violet-800 font-headline font-black uppercase tracking-wider">
              {lang === 'en' ? 'Final Sacred Codex' : 'Ұлы Алтын Кодекс'}
            </div>
            <div className="font-headline text-base font-black text-on-surface">
              {lang === 'en' ? 'Otrar Golden Codex Manuscript' : 'Отырар Кітапханасының Алтын Кодексі'}
            </div>
            <div className="text-xs text-on-surface-variant font-medium">
              {lang === 'en' ? '+300 XP • +200 Time Coins' : '+300 XP • +200 Уақыт Монетасы'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onComplete(10)}
          className="w-full max-w-xs py-3.5 bg-primary hover:bg-primary-container text-on-primary font-headline font-black rounded-2xl shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-base"
        >
          {lang === 'en' ? 'Restore Time Crystal' : 'Уақыт Кристалын Тұтастау'}
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
          {lang === 'en' ? 'Exit Dungeon' : 'Картаға қайту'}
        </button>

        <div className="text-xs font-headline font-black text-violet-800 bg-violet-100 px-3 py-1 rounded-full border border-violet-200">
          {lang === 'en' ? `Chamber ${chamber} of 3` : `${chamber} / 3 Құлыпты Бөлме`}
        </div>
      </div>

      {/* Chamber 1: Runic Lock */}
      {chamber === 1 && (
        <div className="animate-fadeIn">
          <div className="text-center mb-6">
            <span className="text-[11px] font-headline font-black text-violet-700 uppercase tracking-widest block mb-1">
              {lang === 'en' ? 'CHAMBER 1: ANCIENT RUNIC PORTAL' : '№1 БӨЛМЕ: КӨНЕ ТҮРКІ РУНА ҚҰЛПЫ'}
            </span>
            <h3 className="font-headline text-base sm:text-lg font-black text-on-surface mb-2">
              {lang === 'en'
                ? 'Which sacred symbol represents "Tengri" (The Eternal Sky) in ancient Orkhon runes?'
                : 'Көне Орхон жазуында «Тәңірі» (Мәңгілік Көк Аспан) ұғымын білдіретін қасиетті рунаны таңдаңыз:'}
            </h3>
            <p className="font-body text-xs text-on-surface-variant font-medium">
              {lang === 'en' ? 'Select the correct runic inscription to unseal the chamber doors.' : 'Қақпаны ашу үшін дұрыс таңбаны басыңыз.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto mb-6">
            {[
              { id: 'r1', symbol: '𐰋', name: '«Ел / Мемлекет»', nameEn: 'State / Realm', correct: false },
              { id: 'r2', symbol: '𐱅𐰭𐰼𐰃', name: '«Тәңірі / Аспан»', nameEn: 'Tengri / Sky', correct: true },
              { id: 'r3', symbol: '𐰽', name: '«Су / Өзен»', nameEn: 'Water / River', correct: false }
            ].map((rune) => (
              <button
                key={rune.id}
                type="button"
                onClick={() => handleSelectRune(rune.correct)}
                className="p-5 rounded-2xl bg-surface-container-lowest border-2 border-surface-container hover:border-violet-400 hover:bg-violet-50/50 shadow-[0_3px_0_0_#dcdad2] transition-all text-center cursor-pointer group"
              >
                <div className="text-4xl font-serif text-violet-800 group-hover:scale-110 transition-transform mb-2">
                  {rune.symbol}
                </div>
                <div className="font-headline text-xs font-black text-on-surface">
                  {lang === 'en' ? rune.nameEn : rune.name}
                </div>
              </button>
            ))}
          </div>

          {runeAnswer === 'wrong' && (
            <p className="text-xs text-red-600 text-center animate-shake font-headline font-black">
              ❌ {lang === 'en' ? 'Wrong rune. Try another symbol!' : 'Қате руна таңдалды. Басқа таңбаны көріңіз!'}
            </p>
          )}
        </div>
      )}

      {/* Chamber 2: Constellation Alignment */}
      {chamber === 2 && (
        <div className="animate-fadeIn">
          <div className="text-center mb-6">
            <span className="text-[11px] font-headline font-black text-violet-700 uppercase tracking-widest block mb-1">
              {lang === 'en' ? 'CHAMBER 2: ASTRAL CONSTELLATION WHEEL' : '№2 БӨЛМЕ: ДАЛА ШОҚЖҰЛДЫЗЫ ҚҰПИЯСЫ'}
            </span>
            <h3 className="font-headline text-base sm:text-lg font-black text-on-surface mb-2">
              {lang === 'en'
                ? 'Align all 3 nomadic guide stars (Polaris, Steppe Dipper, and Sirius) into resonance.'
                : 'Ұлы Дала түнде жол көрсететін 3 бағыттаушы жұлдызды жарқыратып, сәуле түйінін жасаңыз.'}
            </h3>
            <p className="font-body text-xs text-on-surface-variant font-medium">
              {lang === 'en' ? 'Click each star node to activate its celestial beam.' : 'Әр жұлдыздың түйінін басып қосыңыз.'}
            </p>
          </div>

          <div className="flex justify-center gap-6 mb-6">
            {[
              { id: 0, label: 'Темірқазық (Polaris)' },
              { id: 1, label: 'Жетіқарақшы (Great Bear)' },
              { id: 2, label: 'Сүмбіле (Sirius)' }
            ].map((star) => (
              <button
                key={star.id}
                type="button"
                onClick={() => toggleStar(star.id)}
                className={`w-28 h-28 rounded-3xl border-2 flex flex-col items-center justify-center p-3 cursor-pointer transition-all duration-200 ${
                  starsAligned[star.id]
                    ? 'bg-amber-100 border-amber-400 shadow-[0_4px_0_0_#fde68a] scale-105'
                    : 'bg-surface-container-lowest border-surface-container hover:border-violet-300 shadow-[0_3px_0_0_#dcdad2] text-on-surface-variant'
                }`}
              >
                <span className={`text-4xl mb-1 ${starsAligned[star.id] ? 'text-amber-500 animate-spin' : 'text-stone-400'}`}>
                  ⭐
                </span>
                <span className="text-xs font-headline font-bold text-on-surface text-center leading-tight">
                  {star.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chamber 3: Year Code (1465) */}
      {chamber === 3 && (
        <div className="animate-fadeIn">
          <div className="text-center mb-6">
            <span className="text-[11px] font-headline font-black text-violet-700 uppercase tracking-widest block mb-1">
              {lang === 'en' ? 'CHAMBER 3: MASTER CITADEL VAULT CODE' : '№3 БӨЛМЕ: ОРДА САНДЫҒЫНЫҢ ҚҰПИЯ САНЫ'}
            </span>
            <h3 className="font-headline text-base sm:text-lg font-black text-on-surface mb-2">
              {lang === 'en'
                ? 'Enter the 4-digit sacred foundation year of the Kazakh Khanate:'
                : 'Қазақ хандығының іргетасы қаланған қасиетті 4 таңбалы тарихи жылды теріңіз:'}
            </h3>
            <p className="font-body text-xs text-on-surface-variant font-medium">
              💡 {lang === 'en' ? 'Hint: Kerey and Zhanibek raised the banner in...' : 'Кеңес: Керей мен Жәнібек ту тіккен жыл...'}
            </p>
          </div>

          {/* 4 Digit Counter dials */}
          <div className="flex justify-center gap-3 mb-6">
            {digits.map((digit, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDigitChange(idx, 1)}
                  className="w-12 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center cursor-pointer border border-surface-container-high shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">expand_less</span>
                </button>
                <div className="w-14 h-16 rounded-2xl bg-surface-container-lowest border-2 border-primary/40 flex items-center justify-center text-3xl font-headline font-black font-mono text-primary shadow-[0_3px_0_0_#bbf7d0]">
                  {digit}
                </div>
                <button
                  type="button"
                  onClick={() => handleDigitChange(idx, -1)}
                  className="w-12 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center cursor-pointer border border-surface-container-high shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">expand_more</span>
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleVerifyCode}
              className="px-8 py-3.5 bg-primary hover:bg-primary-container text-on-primary font-headline font-black rounded-2xl shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined">lock_open</span>
              {lang === 'en' ? 'Unlock Final Crystal' : 'Құлыпты Ашу'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
