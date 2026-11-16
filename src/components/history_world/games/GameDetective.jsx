import React, { useState } from 'react';
import sounds from '../../../utils/audio';
import confetti from 'canvas-confetti';

const CASE_FILES = [
  {
    id: 'case_seal',
    title: '№1 АЙҒАҚ: Ханның Құпия Мөрі',
    titleEn: 'CLUE 1: The Royal Wax Seal',
    icon: 'verified',
    description: 'Жыртылған хаттың бұрышынан түрік руналары мен қасқыр бейнесі қашалған көне қола мөр табылды. Мөрде «Ел бірлігі — туымыз» деген ұран бар.',
    descriptionEn: 'On the torn parchment edge, a bronze seal bearing ancient Turkic wolf emblems was found with the motto: "Unity is our eternal banner".'
  },
  {
    id: 'case_witness',
    title: '№2 АЙҒАҚ: Керуенбасының Куәлігі',
    titleEn: 'CLUE 2: The Caravan Master Note',
    icon: 'record_voice_over',
    description: '«Біз Шу мен Талас бойынан өткенде, 1465 жылдың көктемі еді. Екі сұлтан — Керей мен Жәнібек қалың елді бастап, Қозыбасы жайлауына ту тіккенін көзіммен көрдім...»',
    descriptionEn: '"When we traversed the Chu and Talas rivers in the spring of 1465, I witnessed Sultans Kerey and Zhanibek raising their royal banner at Kozybasy..."'
  },
  {
    id: 'case_parchment',
    title: '№3 АЙҒАҚ: Тарихи Құжат Қалдығы',
    titleEn: 'CLUE 3: Archive Parchment Fragment',
    icon: 'description',
    description: '«...Әбілқайыр хандығынан бөлінген ел еркіндікке қол жеткізді. Олар өздерін еркін адамдар — ҚАЗАҚ деп атады!»',
    descriptionEn: '"...The people who departed from the Abulkhair Khanate attained sacred independence. They proclaimed themselves free nomads — KAZAKHS!"'
  }
];

export default function GameDetective({ onComplete, onExit, lang = 'kk' }) {
  const [inspectedClues, setInspectedClues] = useState({ 0: true, 1: true, 2: true });
  const [activeClueIndex, setActiveClueIndex] = useState(0);
  const [verdictAnswer, setVerdictAnswer] = useState(null);
  const [verdictResult, setVerdictResult] = useState(null);

  const handleInspectClue = (idx) => {
    sounds.playTap?.();
    setActiveClueIndex(idx);
    setInspectedClues(prev => ({ ...prev, [idx]: true }));
  };

  const handleSolveCase = (optionIdx) => {
    setVerdictAnswer(optionIdx);
    if (optionIdx === 0) {
      sounds.playCorrect?.();
      sounds.playFanfare?.();
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
      setVerdictResult('success');
    } else {
      sounds.playWrong?.();
      setVerdictResult('fail');
    }
  };

  if (verdictResult === 'success') {
    return (
      <div className="bg-surface-container-lowest border-2 border-surface-container shadow-[0_8px_0_0_#dcdad2] rounded-3xl p-6 sm:p-10 text-on-surface text-center max-w-2xl mx-auto animate-popIn">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-4xl mb-4 shadow-[0_4px_0_0_#a7f3d0]">
          🔍
        </div>
        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-headline font-black text-xs rounded-full border border-emerald-200 mb-2">
          {lang === 'en' ? 'FRAGMENT #2 RECOVERED' : '2-ШІ СЫНЫҚ ТАБЫЛДЫ'}
        </span>
        <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface mb-2">
          {lang === 'en' ? 'Historical Mystery Solved!' : 'Тарихи Құпия Шешілді!'}
        </h2>
        <p className="font-body text-on-surface-variant text-xs sm:text-sm max-w-md mx-auto mb-6">
          {lang === 'en'
            ? 'Your sharp detective reasoning unlocked the Truth Fragment and restored the Sacred Khan Seal from the Royal Archives!'
            : 'Сіз барлық айғақтарды салыстырып, Қазақ хандығының құрылуы туралы ақиқатты дәлелдедіңіз. Ханның Қасиетті Мөрі табылды!'}
        </p>

        {/* Artifact Box */}
        <div className="bg-emerald-50/60 border-2 border-emerald-200 rounded-2xl p-4 mb-6 flex items-center gap-4 text-left max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-3xl">
            🔏
          </div>
          <div>
            <div className="text-[10px] text-emerald-800 font-headline font-black uppercase tracking-wider">
              {lang === 'en' ? 'New Sacred Artifact' : 'Жаңа Қасиетті Жәдігер'}
            </div>
            <div className="font-headline text-base font-black text-on-surface">
              {lang === 'en' ? 'Sacred Khan Seal' : 'Ханның Қасиетті Мөрі'}
            </div>
            <div className="text-xs text-on-surface-variant font-medium">
              {lang === 'en' ? '+160 XP • +90 Time Coins' : '+160 XP • +90 Уақыт Монетасы'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onComplete(2)}
          className="w-full max-w-xs py-3.5 bg-primary hover:bg-primary-container text-on-primary font-headline font-black rounded-2xl shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-base"
        >
          {lang === 'en' ? 'Claim Rewards & Return' : 'Сыйлықты Алып Картаға Қайту'}
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
          {lang === 'en' ? 'Exit Archive' : 'Картаға қайту'}
        </button>
        <div className="text-xs font-headline font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm material-symbols-filled">policy</span>
          {lang === 'en' ? 'Investigation Desk' : 'Детективтік Зерттеу'}
        </div>
      </div>

      {/* Case Briefing Banner */}
      <div className="bg-surface-container-low border border-surface-container rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
            <span className="material-symbols-outlined">menu_book</span>
          </div>
          <div>
            <h3 className="font-headline text-base font-black text-on-surface mb-1">
              {lang === 'en' ? 'Case File #1465: The Genesis of the Steppe State' : '№1465 Іс: Мемлекет Бастауының Құпиясы'}
            </h3>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed font-medium">
              {lang === 'en'
                ? 'Examine all 3 clues below by clicking each tab. Once you have pieced together the evidence, issue your historical verdict to identify the founders.'
                : 'Төмендегі 3 айғақты кезекпен басып, толық оқып шығыңыз. Барлық деректерді жинақтаған соң, Қазақ хандығының бастауы туралы қорытынды шешімді таңдаңыз.'}
            </p>
          </div>
        </div>
      </div>

      {/* Clues Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {CASE_FILES.map((clue, idx) => {
          const active = activeClueIndex === idx;

          return (
            <button
              key={clue.id}
              type="button"
              onClick={() => handleInspectClue(idx)}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                active
                  ? 'bg-primary/10 border-primary shadow-[0_3px_0_0_#337801]'
                  : 'bg-surface-container-lowest border-surface-container hover:border-primary/40 shadow-[0_2px_0_0_#dcdad2]'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                active ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined text-lg">{clue.icon}</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-headline text-xs font-black truncate text-on-surface">
                  {lang === 'en' ? clue.titleEn : clue.title}
                </div>
                <div className="text-[10px] font-headline font-bold text-primary">
                  {lang === 'en' ? 'Click to inspect' : 'Айғақты көру'}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Clue Detail Viewer */}
      <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 text-xs font-headline font-black text-amber-800 uppercase tracking-widest mb-2">
          <span className="material-symbols-outlined text-sm">visibility</span>
          {lang === 'en' ? CASE_FILES[activeClueIndex].titleEn : CASE_FILES[activeClueIndex].title}
        </div>
        <p className="text-on-surface text-sm sm:text-base leading-relaxed font-serif bg-white p-4 rounded-xl border border-amber-200/80 shadow-sm">
          {lang === 'en' ? CASE_FILES[activeClueIndex].descriptionEn : CASE_FILES[activeClueIndex].description}
        </p>
      </div>

      {/* Detective Final Deduction / Verdict */}
      <div className="bg-surface-container-low border border-surface-container rounded-2xl p-5">
        <h4 className="font-headline text-sm sm:text-base font-black text-on-surface mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">gavel</span>
          {lang === 'en' ? 'Detective Final Verdict:' : 'Детективтің қорытынды шешімі:'}
        </h4>
        <p className="font-body text-xs text-on-surface-variant mb-4 font-medium">
          {lang === 'en'
            ? 'Based on the three examined clues, which historical conclusion is strictly accurate?'
            : 'Жиналған үш айғақ бойынша қандай тарихи қорытынды нақты әрі ақиқат?'}
        </p>

        <div className="space-y-2.5">
          {[
            {
              text: '1465 жылы Керей мен Жәнібек Шу бойында Қазақ хандығының негізін қалады',
              textEn: 'In 1465, Kerey and Zhanibek established the Kazakh Khanate along the Chu river',
              correct: true
            },
            {
              text: 'Хат Алтын Орданың ыдырауы кезінде Батый ханның жарлығымен жазылған',
              textEn: 'The scroll was drafted under Batu Khan during Golden Horde decline',
              correct: false
            },
            {
              text: 'Мөр тек парсы саудагерлерінің тауар қауіпсіздігін растайтын құжат',
              textEn: 'The seal belongs exclusively to Persian merchant trade agreements',
              correct: false
            }
          ].map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSolveCase(idx)}
              className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-headline font-bold transition-all flex items-center justify-between cursor-pointer ${
                verdictAnswer === idx
                  ? opt.correct
                    ? 'bg-primary/10 border-primary text-primary font-black shadow-[0_3px_0_0_#337801]'
                    : 'bg-red-50 border-red-500 text-red-700 shadow-[0_3px_0_0_#b91c1c] font-black'
                  : 'bg-surface-container-lowest border-surface-container hover:border-primary text-on-surface shadow-[0_3px_0_0_#dcdad2]'
              }`}
            >
              <span>{lang === 'en' ? opt.textEn : opt.text}</span>
              <span className="material-symbols-outlined text-sm">
                {verdictAnswer === idx ? (opt.correct ? 'done_all' : 'close') : 'arrow_forward_ios'}
              </span>
            </button>
          ))}
        </div>

        {verdictResult === 'fail' && (
          <p className="text-xs text-red-600 mt-3 text-center animate-shake font-headline font-black">
            ❌ {lang === 'en' ? 'Incorrect deduction. Re-read the clues and try again!' : 'Дұрыс емес. Айғақтарды қайта оқып, тағы көріңіз!'}
          </p>
        )}
      </div>
    </div>
  );
}
