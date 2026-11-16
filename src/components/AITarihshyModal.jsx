import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const KNOWLEDGE_BASE_KK = [
  {
    keywords: ['ботай', 'жылқы', 'мал', 'botai', 'horse'],
    answer: 'Ботай мәдениеті (б.з.д. IV–III мыңжылдықтар) — Солтүстік Қазақстан аумағындағы энеолит дәуірінің әлемге әйгілі мәдениеті. Дәл осы жерде адамзат тарихында ТҰҢҒЫШ РЕТ жабайы жылқы қолға үйретілген. Археологиялық қазбаларда 300 000-нан астам жылқы сүйектері мен бие сүтінің (қымыздың) қалдықтары бар қыш ыдыстар табылған!'
  },
  {
    keywords: ['томирис', 'кир', 'сақ', 'кирош', 'tomyris', 'cyrus'],
    answer: 'Томирис — массагет (сақ) тайпаларының әйгілі жауынгер патшайымы. Б.з.д. 530 жылы ол Ұлы Даланы жаулап алуға келген Парсы патшасы Кирдің қалың әскерін талқандап, ел тәуелсіздігін сақтап қалды.'
  },
  {
    keywords: ['алтын адам', 'есік', 'қорған', 'golden man', 'issyk'],
    answer: '«Алтын адам» — 1969 жылы Алматы маңындағы Есік обасынан археолог Кемал Ақышев тапқан жас сақ жауынгері. Ол 4000-нан астам таза алтын бұйымдармен және 48 см биік тәжімен көмкерілген.'
  },
  {
    keywords: ['қаратау', 'шапқыш', 'бифас', 'кремний', 'тас құрал', 'karatau'],
    answer: 'Қаратау жотасындағы (Шабақты, Тәңірқазған, Бөріқазған) үңгірлерден 5000-нан астам тас құрал табылған. Ерте палеолит адамы кремний мен кварцитті қашап, әмбебап қол шапқыштарын (бифастар) жасаған.'
  },
  {
    keywords: ['хандық', 'керей', 'жәнібек', '1465', 'khanate'],
    answer: 'Қазақ хандығы — 1465 жылы Жетісу өңірінде (Қозыбасыда) Керей мен Жәнібек хандардың бастауымен құрылған тұңғыш дербес мемлекетіміз.'
  }
];

const KNOWLEDGE_BASE_EN = [
  {
    keywords: ['botai', 'horse', 'domestication'],
    answer: 'The Botai culture (4th–3rd millennia BC) in Northern Kazakhstan is globally renowned as the earliest known site of horse domestication. Archaeological evidence reveals over 300,000 horse bones and pottery shards with traces of mare milk (koumiss)!'
  },
  {
    keywords: ['tomyris', 'cyrus', 'saka', 'persia'],
    answer: 'Queen Tomyris was the legendary ruler of the Massagetae (Saka) confederation. In 530 BC, she defeated Cyrus the Great of Persia, preserving the freedom and independence of the Eurasian Steppe.'
  },
  {
    keywords: ['golden man', 'issyk', 'kurgan', 'altyn adam'],
    answer: 'The "Golden Man" was discovered in 1969 at the Issyk kurgan near Almaty by Kazakh archaeologist Kemal Akishev. The warrior was buried in an ornate costume decorated with over 4,000 pure gold plaques.'
  },
  {
    keywords: ['karatau', 'flint', 'handaxe', 'biface', 'stone'],
    answer: 'The Karatau mountain ridge in southern Kazakhstan yielded over 5,000 early Paleolithic flint handaxes (bifaces) knapped by prehistoric hunter-gatherer clans.'
  },
  {
    keywords: ['khanate', 'kerei', 'zhanibek', '1465'],
    answer: 'The Kazakh Khanate was established in 1465 in Zhetysu under Sultan Kerei and Sultan Zhanibek, marking the unification of Kazakh nomadic tribes into an independent state.'
  }
];

export default function AITarihshyModal({ isOpen, onClose, onAskQuestion, initialPrompt }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === 'en' ? 'en' : 'kk';

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: t('ai.initial_msg')
    }
  ]);
  const [input, setInput] = useState('');

  // Auto-send initial prompt if provided
  useEffect(() => {
    if (isOpen && initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  if (!isOpen) return null;

  const quickPrompts = [
    t('ai.prompt_1'),
    t('ai.prompt_2'),
    t('ai.prompt_3'),
    t('ai.prompt_4')
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    if (onAskQuestion) {
      onAskQuestion();
    }

    // Match responses
    setTimeout(() => {
      const qLower = query.toLowerCase();
      const kb = currentLang === 'en' ? KNOWLEDGE_BASE_EN : KNOWLEDGE_BASE_KK;
      let match = kb.find((k) =>
        k.keywords.some((kw) => qLower.includes(kw))
      );

      const aiReply = match
        ? match.answer
        : currentLang === 'en'
        ? `Great historical question! Kazakhstan's Eurasian Steppe history contains profound civilizational milestones regarding "${query}". Let's discuss further historical topics!`
        : `Керемет сұрақ! «${query}» тақырыбы бойынша Қазақстанның Ұлы Дала тарихында терең деректер бар. Ботай дәуірінен бастап Қазақ хандығына дейінгі кезең бойынша кез келген сұрақты талқылай аламыз!`;

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest w-full max-w-xl rounded-3xl shadow-2xl border border-surface-container overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 px-6 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-tertiary shadow-sm">
              <span className="material-symbols-outlined text-2xl">psychology</span>
            </div>
            <div>
              <h3 className="font-headline text-lg font-extrabold text-on-surface leading-tight">
                {t('ai.title')}
              </h3>
              <span className="font-label-sm text-xs text-primary font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                {t('ai.active_status')}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Chat message area */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 min-h-[260px] max-h-[380px] bg-background">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center text-sm font-bold shrink-0">
                  AI
                </div>
              )}
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl font-body text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-primary-container text-on-primary rounded-tr-none font-semibold shadow-sm'
                    : 'bg-surface-container-low text-on-surface rounded-tl-none border border-surface-container shadow-sm'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-4 py-2 bg-surface-container-low border-t border-surface-container flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="shrink-0 px-3 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant text-xs font-headline font-bold transition-all border border-surface-container"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-surface-container-low border-t border-surface-container flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ai.input_placeholder')}
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-surface-container text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center hover:opacity-90 active:translate-y-0.5 transition-all shadow-[0_2px_0_0_#46a302] cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
