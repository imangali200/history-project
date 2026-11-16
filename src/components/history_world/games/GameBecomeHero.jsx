import React, { useState } from 'react';
import sounds from '../../../utils/audio';
import confetti from 'canvas-confetti';

const DILEMMAS = [
  {
    id: 'dilemma_1',
    title: '№1 ТАҢДАУ: Екі Империя Арасындағы Дипломатия',
    titleEn: 'DILEMMA 1: Dual Empire Steppe Diplomacy',
    desc: 'Ресей мен Цин (Қытай) елшілері бір мезгілде Ордаңызға келді. Екі империя да өзіне бодан болуды талап етуде. Ұлы Хан ретінде қандай жолды таңдайсыз?',
    descEn: 'Envoys from both the Russian and Qing empires arrive at your pavilion, demanding total allegiance. As sovereign Khan, what is your decree?',
    choices: [
      {
        text: 'Теңгермелі дипломатия: Екі елмен де бейбіт сауда мен достық келісім жасап, дербестікті сақтау',
        textEn: 'Equilibrium Diplomacy: Maintain sovereign autonomy, open trade pacts with both without submitting',
        effects: { unity: 15, defense: 10, wealth: 20 },
        feedback: 'Дана шешім! Абылай хан осы стратегия арқылы қазақ елінің тәуелсіздігі мен тыныштығын сақтап қалған.'
      },
      {
        text: 'Бір империяға толық бағынып, екіншісіне қарсы соғыс ашу',
        textEn: 'Unconditional Vassalage: Pledge full loyalty to one side and launch war on the other',
        effects: { unity: -25, defense: -10, wealth: -15 },
        feedback: 'Қауіпті қадам! Бұл ел ішінде жік туғызып, көршілермен қантөгіске әкеледі.'
      }
    ]
  },
  {
    id: 'dilemma_2',
    title: '№2 ТАҢДАУ: Құрылтайдағы Заң мен Тәртіп',
    titleEn: 'DILEMMA 2: The Kurultai Council of Sages',
    desc: 'Күзгі Құрылтайда Төле би, Қазыбек би және Әйтеке билер дау-дамайды шешу үшін жаңа біртұтас заң қабылдауды ұсынды. Сіздің жарлығыңыз:',
    descEn: 'At the autumn Kurultai, supreme judges Tole, Qazybek, and Aiteke propose establishing a unified nomad legal code. What is your decree?',
    choices: [
      {
        text: '«Жеті Жарғы» ережелерін бекітіп, билер сотын күшейту және рулар бірлігін заңдастыру',
        textEn: 'Ratify the "Zheti Zhargy" codes, empowering traditional jurisprudence and tribal confederation',
        effects: { unity: 25, defense: 15, wealth: 10 },
        feedback: 'Ұлы реформа! Бұл заң қазақ қоғамындағы дауларды бейбіт шешіп, хандықты іштей бекемдеді.'
      },
      {
        text: 'Заң қабылдауды кейінге қалдырып, тек қарулы күшке сүйену',
        textEn: 'Postpone legal codification and rule exclusively through martial decree',
        effects: { unity: -20, defense: 5, wealth: -10 },
        feedback: 'Әділетсіздік халық наразылығын тудырып, ел іргесін шайқалтады.'
      }
    ]
  },
  {
    id: 'dilemma_3',
    title: '№3 ТАҢДАУ: Ұлы Жібек Жолы мен Сауда Бекеттері',
    titleEn: 'DILEMMA 3: Securing the Silk Road Caravan Hubs',
    desc: 'Отырар мен Сығанақ қалаларында сауда керуендері тоқтады. Қазынаны байытып, қауіпсіздікті қамтамасыз ету үшін не істейсіз?',
    descEn: 'Merchant caravans have arrived along Otrar and Sygnak. To enrich the royal treasury while guaranteeing transit safety, what will you do?',
    choices: [
      {
        text: 'Керуен жолдарына арнайы қорғау жасақтарын қойып, әділ сауда салығын енгізу',
        textEn: 'Deploy sovereign escort squadrons along trade corridors and implement fair commerce tariffs',
        effects: { unity: 15, defense: 15, wealth: 30 },
        feedback: 'Керемет экономикалық қадам! Қалалар гүлденіп, хандықтың беделі артты.'
      },
      {
        text: 'Саудагерлерден шамадан тыс ауыр салық жинап, қалаларды жабу',
        textEn: 'Levy crushing extortionate tariffs on foreign merchants and shutter citadels',
        effects: { unity: -15, defense: -5, wealth: -20 },
        feedback: 'Керуендер балама бағыттарға көшіп, сауда мүлдем тоқтады.'
      }
    ]
  }
];

export default function GameBecomeHero({ onComplete, onExit, lang = 'kk' }) {
  const [stats, setStats] = useState({ unity: 50, defense: 50, wealth: 50 });
  const [step, setStep] = useState(0);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentDilemma = DILEMMAS[step];

  const handleChoose = (choice) => {
    sounds.playTap?.();
    const newStats = {
      unity: Math.min(100, Math.max(10, stats.unity + choice.effects.unity)),
      defense: Math.min(100, Math.max(10, stats.defense + choice.effects.defense)),
      wealth: Math.min(100, Math.max(10, stats.wealth + choice.effects.wealth))
    };
    setStats(newStats);
    setLastFeedback(choice.feedback);

    if (choice.effects.unity > 0) {
      sounds.playCorrect?.();
    } else {
      sounds.playWrong?.();
    }

    setTimeout(() => {
      if (step < DILEMMAS.length - 1) {
        setStep(prev => prev + 1);
        setLastFeedback(null);
      } else {
        sounds.playFanfare?.();
        setIsCompleted(true);
        confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
      }
    }, 1200);
  };

  if (isCompleted) {
    return (
      <div className="bg-surface-container-lowest border-2 border-surface-container shadow-[0_8px_0_0_#dcdad2] rounded-3xl p-6 sm:p-10 text-on-surface text-center max-w-2xl mx-auto animate-popIn">
        <div className="w-20 h-20 mx-auto rounded-full bg-teal-100 border-2 border-teal-300 flex items-center justify-center text-4xl mb-4 shadow-[0_4px_0_0_#99f6e4]">
          👑
        </div>
        <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 font-headline font-black text-xs rounded-full border border-teal-200 mb-2">
          {lang === 'en' ? 'FRAGMENT #7 CONQUERED' : '7-ШІ СЫНЫҚ ИЕЛЕНІЛДІ'}
        </span>
        <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface mb-2">
          {lang === 'en' ? 'Wise Ruler Legacy Established!' : 'Хан Тағында Даналық Салтанат Құрды!'}
        </h2>
        <p className="font-body text-on-surface-variant text-xs sm:text-sm max-w-md mx-auto mb-6">
          {lang === 'en'
            ? 'Your statesman wisdom balanced unity, defenses, and prosperity. You earned the Leadership Fragment and Kasym Khan’s Golden Code!'
            : 'Сіз Ұлы Хан ретінде ел бірлігін, қорғанысы мен қазынасын кемеңгерлікпен сақтап, Көшбасшы Жүрегі мен Қасым Ханның «Қасқа Жолын» алдыңыз!'}
        </p>

        {/* Artifact Showcase */}
        <div className="bg-teal-50/60 border-2 border-teal-200 rounded-2xl p-4 mb-6 flex items-center gap-4 text-left max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-teal-100 border border-teal-300 flex items-center justify-center text-3xl">
            ⚖️
          </div>
          <div>
            <div className="text-[10px] text-teal-800 font-headline font-black uppercase tracking-wider">
              {lang === 'en' ? 'Sacred Law Scroll' : 'Қасиетті Заң Жарғысы'}
            </div>
            <div className="font-headline text-base font-black text-on-surface">
              {lang === 'en' ? "Kasym Khan's Golden Code" : 'Қасым Ханның «Қасқа Жолы» Ережесі'}
            </div>
            <div className="text-xs text-on-surface-variant font-medium">
              {lang === 'en' ? '+200 XP • +110 Time Coins' : '+200 XP • +110 Уақыт Монетасы'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onComplete(7)}
          className="w-full max-w-xs py-3.5 bg-primary hover:bg-primary-container text-on-primary font-headline font-black rounded-2xl shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-base"
        >
          {lang === 'en' ? 'Accept Royal Tribute & Return' : 'Жүлдені Алып Картаға Қайту'}
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
          {lang === 'en' ? 'Leave Throne' : 'Картаға қайту'}
        </button>
        <div className="text-xs font-headline font-black text-teal-800 bg-teal-100 px-3 py-1 rounded-full border border-teal-200 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm material-symbols-filled">workspace_premium</span>
          {lang === 'en' ? `Decision ${step + 1} of ${DILEMMAS.length}` : `${step + 1} / ${DILEMMAS.length} Тарихи Шешім`}
        </div>
      </div>

      {/* Realm Vitals Dashboard */}
      <div className="grid grid-cols-3 gap-3 mb-6 bg-surface-container-low p-4 rounded-2xl border border-surface-container">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-headline font-black text-teal-800">🤝 {lang === 'en' ? 'Unity' : 'Бірлік'}</span>
            <span className="font-mono font-black text-teal-900">{stats.unity}%</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
            <div className="bg-teal-500 h-full rounded-full transition-all duration-300" style={{ width: `${stats.unity}%` }} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-headline font-black text-red-700">🛡️ {lang === 'en' ? 'Defense' : 'Қорғаныс'}</span>
            <span className="font-mono font-black text-red-900">{stats.defense}%</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
            <div className="bg-red-500 h-full rounded-full transition-all duration-300" style={{ width: `${stats.defense}%` }} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-headline font-black text-amber-800">💰 {lang === 'en' ? 'Treasury' : 'Қазына'}</span>
            <span className="font-mono font-black text-amber-900">{stats.wealth}%</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${stats.wealth}%` }} />
          </div>
        </div>
      </div>

      {/* Dilemma Scenario */}
      <div className="bg-teal-50/60 border-2 border-teal-200 rounded-2xl p-5 mb-6">
        <div className="text-[11px] font-headline font-black text-teal-800 uppercase tracking-widest mb-1">
          {lang === 'en' ? currentDilemma.titleEn : currentDilemma.title}
        </div>
        <p className="text-on-surface text-sm sm:text-base leading-relaxed font-serif mb-5 font-medium">
          {lang === 'en' ? currentDilemma.descEn : currentDilemma.desc}
        </p>

        {/* Choices */}
        <div className="space-y-3">
          {currentDilemma.choices.map((choice, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChoose(choice)}
              className="w-full p-4 rounded-2xl border-2 border-surface-container bg-surface-container-lowest hover:border-primary text-left text-xs sm:text-sm text-on-surface font-headline font-bold cursor-pointer transition-all active:scale-[0.99] shadow-[0_3px_0_0_#dcdad2] flex items-center justify-between gap-3"
            >
              <span>{lang === 'en' ? choice.textEn : choice.text}</span>
              <span className="material-symbols-outlined text-primary text-lg shrink-0">check_circle</span>
            </button>
          ))}
        </div>
      </div>

      {lastFeedback && (
        <div className="bg-teal-100 border-2 border-teal-300 p-4 rounded-2xl text-center text-xs font-headline font-black text-teal-900 animate-fadeIn">
          💡 {lastFeedback}
        </div>
      )}
    </div>
  );
}
