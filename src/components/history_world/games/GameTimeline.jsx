import React, { useState } from 'react';
import sounds from '../../../utils/audio';
import confetti from 'canvas-confetti';

const TIMELINE_EVENTS = [
  {
    id: 'botai',
    year: 'Б.з.д. IV мыңжылдық',
    yearEn: '4th Millennium BCE',
    title: 'Ботай мәдениеті: Жылқыны қолға үйрету',
    titleEn: 'Botai Culture: First Horse Domestication',
    desc: 'Адамзат тарихында тұңғыш рет жылқы малы қолға үйретіліп, көшпелі өркениеттің бастауы қаланды.',
    descEn: 'Mankind domesticated the wild horse for the first time, giving rise to nomadic civilization.',
    order: 1
  },
  {
    id: 'tomyris',
    year: 'Б.з.д. 530 жыл',
    yearEn: '530 BCE',
    title: 'Томирис патшайымның парсыларды жеңуі',
    titleEn: 'Queen Tomyris Victory over Cyrus',
    desc: 'Сақ даласының еркіндігін қорғап, басқыншы Кир патшаның әскерін талқандады.',
    descEn: 'Heroic defense of Saka nomadic freedom, decisively routing the Persian invader.',
    order: 2
  },
  {
    id: 'turkic',
    year: '552 жыл',
    yearEn: '552 CE',
    title: 'Түрік қағанатының негізі қаланды',
    titleEn: 'First Turkic Khaganate Founded',
    desc: 'Бумын қаған Алтайдан Қара теңізге дейінгі Ұлы Даланы біріктіріп, қағанат құрды.',
    descEn: 'Bumin Khagan united the Great Steppe from the Altai to the Black Sea under imperial banner.',
    order: 3
  },
  {
    id: 'khanate',
    year: '1465 жыл',
    yearEn: '1465 CE',
    title: 'Қазақ хандығының құрылуы',
    titleEn: 'Establishment of the Kazakh Khanate',
    desc: 'Керей мен Жәнібек сұлтандар Қозыбасыда дербес Қазақ мемлекетінің туын тікті.',
    descEn: 'Sultans Kerey and Zhanibek raised the sovereign banner of the Kazakh state at Kozybasy.',
    order: 4
  },
  {
    id: 'independence',
    year: '1991 жыл',
    yearEn: '1991 CE',
    title: 'Қазақстан Тәуелсіздігінің жариялануы',
    titleEn: 'Independence of the Republic of Kazakhstan',
    desc: '16 желтоқсанда егемен Қазақстанның Тәуелсіздігі ресми түрде жарияланды.',
    descEn: 'On December 16, sovereignty and independence were officially proclaimed to the world.',
    order: 5
  }
];

export default function GameTimeline({ onComplete, onExit, lang = 'kk' }) {
  const [items, setItems] = useState([
    TIMELINE_EVENTS[2],
    TIMELINE_EVENTS[0],
    TIMELINE_EVENTS[4],
    TIMELINE_EVENTS[1],
    TIMELINE_EVENTS[3]
  ]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);

  const moveItem = (fromIdx, toIdx) => {
    sounds.playTap?.();
    const newItems = [...items];
    const [moved] = newItems.splice(fromIdx, 1);
    newItems.splice(toIdx, 0, moved);
    setItems(newItems);
    setHasError(false);
  };

  const handleVerify = () => {
    const isCorrect = items.every((item, idx) => item.order === idx + 1);

    if (isCorrect) {
      sounds.playCorrect?.();
      sounds.playFanfare?.();
      setIsSuccess(true);
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    } else {
      sounds.playWrong?.();
      setHasError(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-surface-container-lowest border-2 border-surface-container shadow-[0_8px_0_0_#dcdad2] rounded-3xl p-6 sm:p-10 text-on-surface text-center max-w-2xl mx-auto animate-popIn">
        <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl mb-4 shadow-[0_4px_0_0_#fde68a]">
          ⏳
        </div>
        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 font-headline font-black text-xs rounded-full border border-amber-200 mb-2">
          {lang === 'en' ? 'FRAGMENT #6 RESTORED' : '6-ШЫ СЫНЫҚ ОРНЫНА ҚОЙЫЛДЫ'}
        </span>
        <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface mb-2">
          {lang === 'en' ? 'Timeline Temple Restored!' : 'Уақыт Ғибадатханасы Қалпына Келтірілді!'}
        </h2>
        <p className="font-body text-on-surface-variant text-xs sm:text-sm max-w-md mx-auto mb-6">
          {lang === 'en'
            ? 'The temporal flow is synchronized! You secured the Continuity Fragment and the sacred Kultegin Runestone!'
            : 'Ғасырлар тізбегі толық реттелді! Тарих Желісі Кристалы мен Күлтегін Көне Бітіктасы босатылды!'}
        </p>

        {/* Artifact Box */}
        <div className="bg-amber-50/60 border-2 border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-4 text-left max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-3xl">
            🗿
          </div>
          <div>
            <div className="text-[10px] text-amber-800 font-headline font-black uppercase tracking-wider">
              {lang === 'en' ? 'Sacred Inscription' : 'Қасиетті Тас Жазуы'}
            </div>
            <div className="font-headline text-base font-black text-on-surface">
              {lang === 'en' ? 'Kultegin Runestone Inscription' : 'Күлтегін Көне Түркі Бітіктасы'}
            </div>
            <div className="text-xs text-on-surface-variant font-medium">
              {lang === 'en' ? '+160 XP • +80 Time Coins' : '+160 XP • +80 Уақыт Монетасы'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onComplete(6)}
          className="w-full max-w-xs py-3.5 bg-primary hover:bg-primary-container text-on-primary font-headline font-black rounded-2xl shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-base"
        >
          {lang === 'en' ? 'Claim Rewards & Return' : 'Жүлдені Алып Картаға Қайту'}
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
          {lang === 'en' ? 'Exit Temple' : 'Картаға қайту'}
        </button>
        <div className="text-xs font-headline font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm material-symbols-filled">hourglass_empty</span>
          {lang === 'en' ? 'Chronology Alignment' : 'Хронологиялық Реттеу'}
        </div>
      </div>

      <div className="text-center mb-6">
        <h3 className="font-headline text-lg sm:text-xl font-black text-on-surface mb-1">
          {lang === 'en' ? 'Arrange Events from Oldest to Newest' : 'Оқиғаларды Ең Көнесінен Бастап Реттеңіз'}
        </h3>
        <p className="font-body text-xs text-on-surface-variant font-medium">
          {lang === 'en'
            ? 'Use the up/down arrows to position the historical milestone cards in correct order.'
            : 'Жебелерді пайдаланып, тақталарды көне дәуірден бүгінгі күнге қарай реттеп шығыңыз.'}
        </p>
      </div>

      {/* Cards List */}
      <div className="space-y-3 mb-6">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-surface-container-lowest border-2 border-surface-container hover:border-amber-400 shadow-[0_3px_0_0_#dcdad2] transition-all flex items-center gap-4"
          >
            {/* Slot index indicator */}
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 font-headline font-black text-sm flex items-center justify-center shrink-0 border border-amber-200">
              #{idx + 1}
            </div>

            {/* Info */}
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-headline font-bold text-primary mb-0.5">
                {lang === 'en' ? item.yearEn : item.year}
              </div>
              <h4 className="font-headline text-sm font-black text-on-surface truncate">
                {lang === 'en' ? item.titleEn : item.title}
              </h4>
              <p className="font-body text-xs text-on-surface-variant line-clamp-1">
                {lang === 'en' ? item.descEn : item.desc}
              </p>
            </div>

            {/* Move Controls */}
            <div className="flex flex-col gap-1 shrink-0">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => moveItem(idx, idx - 1)}
                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high disabled:opacity-20 flex items-center justify-center text-on-surface cursor-pointer border border-surface-container-high shadow-sm"
              >
                <span className="material-symbols-outlined text-sm font-bold">arrow_upward</span>
              </button>
              <button
                type="button"
                disabled={idx === items.length - 1}
                onClick={() => moveItem(idx, idx + 1)}
                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high disabled:opacity-20 flex items-center justify-center text-on-surface cursor-pointer border border-surface-container-high shadow-sm"
              >
                <span className="material-symbols-outlined text-sm font-bold">arrow_downward</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {hasError && (
        <div className="bg-red-50 border-2 border-red-300 text-red-700 p-3.5 rounded-2xl text-center text-xs font-headline font-black mb-4 animate-shake">
          ❌ {lang === 'en' ? 'The timeline flow is still incorrect. Check dates and adjust!' : 'Реті әлі де қате. Көне дәуір мен жаңа ғасырлар орнын тексеріңіз!'}
        </div>
      )}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleVerify}
          className="px-8 py-3.5 bg-primary hover:bg-primary-container text-on-primary font-headline font-black rounded-2xl shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined">sync</span>
          {lang === 'en' ? 'Verify Temporal Order' : 'Хронологияны Тексеру'}
        </button>
      </div>
    </div>
  );
}
