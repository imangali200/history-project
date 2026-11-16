import React, { useState } from 'react';
import sounds from '../../../utils/audio';
import confetti from 'canvas-confetti';

const ERAS = [
  {
    id: 'saka',
    name: 'Сақ Дәуірі (Б.з.д. VIII–III ғғ.)',
    nameEn: 'Saka Era (8th–3rd Century BCE)',
    figure: 'Томирис Патшайым',
    figureEn: 'Queen Tomyris',
    figureEmoji: '👑',
    dialog: '«Біз — еркін даланың ұрпағымыз! Кир патшаның әскері біздің жерімізге басып кірді. Біздің басты қағидамыз қандай?»',
    dialogEn: '"We are the free children of the steppe! Cyrus invaded our sacred soil. What is our supreme principle?"',
    question: 'Б.з.д. 530 жылы Томирис патшайым кімнің басқыншылығын тойтарып, еркіндікті қорғап қалды?',
    questionEn: 'In 530 BCE, which invader did Queen Tomyris defeat to preserve nomad freedom?',
    options: [
      { text: 'Парсы патшасы Кирдің әскерін', textEn: 'Persian King Cyrus the Great', correct: true },
      { text: 'Рим легиондарын', textEn: 'Roman Legions', correct: false },
      { text: 'Ескендір Зұлқарнайынды', textEn: 'Alexander the Great', correct: false },
      { text: 'Араб халифатын', textEn: 'Arab Caliphate', correct: false }
    ],
    funFact: 'Есік қорғанынан табылған Алтын Адам 4000-нан астам алтын әшекеймен безендірілген. Бұл сақтардың зергерлік шеберлігін дәлелдейді.'
  },
  {
    id: 'turkic',
    name: 'Түрік Қағанаты (552–603 жж.)',
    nameEn: 'Turkic Khaganate (552–603 CE)',
    figure: 'Бумын Қаған & Тоныкөк',
    figureEn: 'Bumin Khagan & Tonyukuk',
    figureEmoji: '🦅',
    dialog: '«Түрік елі жойылмасын деп, түнде ұйықтамадым, күндіз отырмадым. Біздің руналық жазуымыз мәңгілік тасқа қашалды!»',
    dialogEn: '"So that the Turkic nation would not perish, I slept not by night nor rested by day. Our runes are carved into eternal stone!"',
    question: '552 жылы Түрік қағанатының негізін қалаған ұлы билеуші кім?',
    questionEn: 'Who founded the First Turkic Khaganate in 552 CE?',
    options: [
      { text: 'Бумын қаған', textEn: 'Bumin Khagan', correct: true },
      { text: 'Шыңғыс хан', textEn: 'Genghis Khan', correct: false },
      { text: 'Мөде қаған', textEn: 'Modu Chanyu', correct: false },
      { text: 'Еділ (Аттила) патша', textEn: 'Attila the Hun', correct: false }
    ],
    funFact: 'Түріктер темір балқыту өнерін жоғары деңгейге жеткізіп, Ұлы Жібек жолының басым бөлігін бақылауда ұстады.'
  },
  {
    id: 'golden_horde',
    name: 'Алтын Орда (Жошы Ұлысы, 1242 ж.)',
    nameEn: 'Golden Horde (Jochi Ulus, 1242)',
    figure: 'Батый Хан',
    figureEn: 'Batu Khan',
    figureEmoji: '⛺',
    dialog: '«Еділ мен Жайық бойында Сарай қаласы бой көтерді. Саудагерлер мен керуендер қауіпсіз сапар шегеді!»',
    dialogEn: '"Sarai arose on the Volga and Ural rivers. Merchants and caravans travel under total imperial protection!"',
    question: 'Алтын Орданың орталығы болған, Жібек жолының ірі сауда шаһары:',
    questionEn: 'The magnificent capital and trade metropolis of the Golden Horde was:',
    options: [
      { text: 'Сарай-Бату (Сарай-Берке)', textEn: 'Sarai-Batu (Sarai-Berke)', correct: true },
      { text: 'Константинополь', textEn: 'Constantinople', correct: false },
      { text: 'Бағдат қаласы', textEn: 'Baghdad', correct: false },
      { text: 'Самарқанд', textEn: 'Samarkand', correct: false }
    ],
    funFact: 'Алтын Орда мемлекеттік құрылымы мен әскери дәстүрі кейін Қазақ хандығының құрылуына тікелей негіз болды.'
  },
  {
    id: 'khanate',
    name: 'Қазақ Хандығы (1465 ж.)',
    nameEn: 'Kazakh Khanate (1465 CE)',
    figure: 'Керей мен Жәнібек Хандар',
    figureEn: 'Kerey and Zhanibek Khans',
    figureEmoji: '🗡️',
    dialog: '«Қозыбасы жайлауында туымызды тіктік! Біз еркіндікті сүйген Қазақ еліміз!»',
    dialogEn: '"At the Kozybasy pastures we raised our eternal banner! We are the free Kazakh nation!"',
    question: '1465 жылы Қазақ хандығы алғаш құрылған тарихи мекен:',
    questionEn: 'The historic region where the Kazakh Khanate was first founded in 1465 was:',
    options: [
      { text: 'Жетісудағы Шу мен Қозыбасы өңірі', textEn: 'Chu and Kozybasy region in Zhetysu', correct: true },
      { text: 'Алтай тауларының баурайы', textEn: 'Altai Mountains', correct: false },
      { text: 'Каспий жағалауы', textEn: 'Caspian Shore', correct: false },
      { text: 'Мәскеу түбі', textEn: 'Near Moscow', correct: false }
    ],
    funFact: 'Керей мен Жәнібек сұлтандар Әбілқайыр хандығынан бөлініп, Жетісуға көшіп, 200 мыңнан астам халықты біріктірді.'
  }
];

export default function GameTimeTravel({ onComplete, onExit, lang = 'kk' }) {
  const [currentEraIndex, setCurrentEraIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const era = ERAS[currentEraIndex];

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    const correct = era.options[idx].correct;
    setIsCorrect(correct);

    if (correct) {
      sounds.playCorrect?.();
    } else {
      sounds.playWrong?.();
    }
  };

  const handleNextEra = () => {
    sounds.playTap?.();
    if (currentEraIndex < ERAS.length - 1) {
      setCurrentEraIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setGameFinished(true);
      sounds.playFanfare?.();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  if (gameFinished) {
    return (
      <div className="bg-surface-container-lowest border-2 border-surface-container shadow-[0_8px_0_0_#dcdad2] rounded-3xl p-6 sm:p-10 text-on-surface text-center max-w-2xl mx-auto animate-popIn">
        <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl mb-4 shadow-[0_4px_0_0_#fde68a]">
          ✨
        </div>
        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 font-headline font-black text-xs rounded-full border border-amber-200 mb-2">
          {lang === 'en' ? 'FRAGMENT #1 RESTORED' : '1-ШІ СЫНЫҚ ТАБЫЛДЫ'}
        </span>
        <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface mb-2">
          {lang === 'en' ? 'Time Portal Synchronized!' : 'Уақыт Порталы Сәтті Аяқталды!'}
        </h2>
        <p className="font-body text-on-surface-variant text-xs sm:text-sm max-w-md mx-auto mb-6">
          {lang === 'en'
            ? 'You traversed through the 4 foundational epochs of the Great Steppe and extracted the radiant Sunbeam Fragment!'
            : 'Сіз Ұлы Даланың 4 іргелі дәуірін толық кезіп шығып, Күн Сәулесі Кристалы мен Алтын Адам Тәжін қалпына келтірдіңіз!'}
        </p>

        {/* Artifact Showcase Card */}
        <div className="bg-amber-50/60 border-2 border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-4 text-left max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-3xl">
            👑
          </div>
          <div>
            <div className="text-[10px] text-amber-800 font-headline font-black uppercase tracking-wider">
              {lang === 'en' ? 'New Sacred Artifact' : 'Жаңа Қасиетті Жәдігер'}
            </div>
            <div className="font-headline text-base font-black text-on-surface">
              {lang === 'en' ? 'Crown of the Golden Man' : 'Алтын Адамның Тәжі'}
            </div>
            <div className="text-xs text-on-surface-variant font-medium">
              {lang === 'en' ? '+150 XP • +80 Time Coins' : '+150 XP • +80 Уақыт Монетасы'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onComplete(1)}
          className="w-full max-w-xs py-3.5 bg-primary hover:bg-primary-container text-on-primary font-headline font-black rounded-2xl shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-base"
        >
          {lang === 'en' ? 'Collect Rewards & Return' : 'Жүлдені Алып Картаға Қайту'}
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
          {lang === 'en' ? 'Leave Portal' : 'Картаға қайту'}
        </button>

        <div className="flex items-center gap-2">
          {ERAS.map((e, idx) => (
            <div
              key={e.id}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentEraIndex
                  ? 'w-8 bg-primary'
                  : idx < currentEraIndex
                  ? 'w-4 bg-primary/40'
                  : 'w-2 bg-surface-container-high'
              }`}
            />
          ))}
        </div>

        <div className="text-xs font-headline font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
          {lang === 'en' ? `Era ${currentEraIndex + 1} of 4` : `${currentEraIndex + 1} / 4 Дәуір`}
        </div>
      </div>

      {/* Historical Era Title */}
      <div className="text-center mb-6">
        <span className="text-[11px] font-headline font-black text-primary uppercase tracking-wider block mb-1">
          {lang === 'en' ? 'HISTORICAL ERA SELECTED' : 'ТАРИХИ ДӘУІР'}
        </span>
        <h2 className="font-headline text-xl sm:text-2xl font-black text-on-surface">
          {lang === 'en' ? era.nameEn : era.name}
        </h2>
      </div>

      {/* Historical Figure Dialog Bubble */}
      <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4 sm:p-5 mb-6 flex items-start gap-4">
        <div className="w-13 h-13 shrink-0 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-3xl shadow-sm">
          {era.figureEmoji}
        </div>
        <div className="flex-1">
          <div className="text-xs font-headline font-black text-amber-900 mb-1 flex items-center gap-1.5">
            <span>{lang === 'en' ? era.figureEn : era.figure}</span>
            <span className="text-[10px] text-on-surface-variant font-normal">
              {lang === 'en' ? '• Historic Voice' : '• Үн қату'}
            </span>
          </div>
          <p className="text-on-surface text-xs sm:text-sm italic font-serif leading-relaxed">
            {lang === 'en' ? era.dialogEn : era.dialog}
          </p>
        </div>
      </div>

      {/* Historical Question */}
      <div className="bg-surface-container-low border border-surface-container rounded-2xl p-5 mb-6">
        <h3 className="font-headline text-base sm:text-lg font-black text-on-surface mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-black flex items-center justify-center">
            ?
          </span>
          {lang === 'en' ? era.questionEn : era.question}
        </h3>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {era.options.map((opt, idx) => {
            let btnStyle = 'bg-surface-container-lowest border-surface-container hover:border-primary text-on-surface shadow-[0_3px_0_0_#dcdad2]';
            if (isAnswered) {
              if (opt.correct) {
                btnStyle = 'bg-primary/10 border-primary text-primary font-black shadow-[0_3px_0_0_#337801]';
              } else if (selectedOption === idx) {
                btnStyle = 'bg-red-50 border-red-400 text-red-700 shadow-[0_3px_0_0_#b91c1c] font-bold';
              } else {
                btnStyle = 'opacity-40 border-surface-container';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-headline font-bold transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
              >
                <span>{lang === 'en' ? opt.textEn : opt.text}</span>
                {isAnswered && opt.correct && (
                  <span className="material-symbols-outlined text-primary text-lg material-symbols-filled">check_circle</span>
                )}
                {isAnswered && !opt.correct && selectedOption === idx && (
                  <span className="material-symbols-outlined text-red-500 text-lg material-symbols-filled">cancel</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Did You Know / Next Action */}
      {isAnswered && (
        <div className="animate-fadeIn">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-5 text-xs text-amber-900 leading-relaxed font-body">
            <span className="font-headline font-black text-amber-800 block mb-0.5">
              💡 {lang === 'en' ? 'HISTORICAL INSIGHT:' : 'ТАРИХИ АҚИҚАТ:'}
            </span>
            {era.funFact}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNextEra}
              className="px-6 py-3.5 bg-primary hover:bg-primary-container text-on-primary font-headline font-black rounded-2xl shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer text-sm"
            >
              <span>
                {currentEraIndex < ERAS.length - 1
                  ? (lang === 'en' ? 'Next Historical Era' : 'Келесі Дәуірге Өту')
                  : (lang === 'en' ? 'Complete Temporal Run' : 'Сынақты Аяқтау')}
              </span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
