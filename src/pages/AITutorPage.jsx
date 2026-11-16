import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { sounds } from '../utils/audio';
import { askGeminiAPI, getGeminiApiKey } from '../services/aiService';

// Kazakh phonetic & stem normalization for resilient local search
const normalizeQuery = (text) => {
  return (text || '')
    .toLowerCase()
    .replace(/[қк]/g, 'к')
    .replace(/[ғг]/g, 'г')
    .replace(/[ңн]/g, 'н')
    .replace(/[ұүу]/g, 'у')
    .replace(/[өо]/g, 'о')
    .replace(/[һх]/g, 'х')
    .replace(/[іий]/g, 'и')
    .replace(/[щш]/g, 'ш')
    .replace(/[cс]/g, 'с')
    .replace(/[aа]/g, 'а')
    .replace(/[^a-zа-я0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Rich historical knowledge base with normalized stems
const HISTORICAL_KB_KK = [
  {
    stems: ['казак хандыг', 'хандык', 'хандыгы', 'керей', 'жанибек', '1465', 'козыбасы', 'шу', 'касым хан'],
    title: 'Қазақ хандығының құрылуы (1465 жыл)',
    answer: '⚔️ **Қазақ хандығы 1465 жылы құрылды!**\n\n• **Негізін салушылар:** Керей хан мен Жәнібек хан.\n• **Құрылған жері:** Жетісу өңіріндегі Шу мен Қозыбасы алабы (Моғолстан ханы Есенбұғаның қолдауымен).\n• **Себебі:** Керей мен Жәнібек сұлтандар Әбілқайыр хандығының (Өзбек ұлысы) қатал саясатына қарсылық білдіріп, өздеріне ерген тайпалармен батысқа қарай көшіп келді.\n• **Тарихи маңызы:** Бұл оқиға тұңғыш рет дербес қазақ мемлекеттілігінің негізін қалап, халқымыздың «Қазақ» атауымен дербес ел болып бірігуіне жол ашты!\n• **Гүлденуі:** Қасым ханның тұсында халық саны 1 миллионнан асты («Қасым ханның қасқа жолы» заңдары).',
  },
  {
    stems: ['ботай', 'жылкы', 'энеолит', 'мал', 'кымыз', 'айыртау'],
    title: 'Ботай мәдениеті және жылқыны қолға үйрету',
    answer: '🐎 **Ботай мәдениеті (б.з.д. IV–III мыңжылдықтар)** — Солтүстік Қазақстан аумағындағы (Айыртау ауданы) энеолит дәуірінің әлемге әйгілі ескерткіші.\n\n• **Басты жаңалық:** Адамзат тарихында **ТҰҢҒЫШ РЕТ жабайы жылқы қолға үйретілді**.\n• **Археологиялық дәлелдер:** 300 000-нан астам жылқы сүйектері, ауыздық іздері және қыш ыдыстардағы бие сүтінің (қымыздың) май қышқылдары табылған.\n• **Тарихи маңызы:** Бұл жаңалық бүкіл Еуразия кеңістігінде көшпелі өркениеттің, көлік қатынасы мен сауданың дамуына серпін берді.',
  },
  {
    stems: ['томирис', 'кир', 'массагет', 'парсы', 'ахеменид', '530'],
    title: 'Томирис патшайым және Парсы шапқыншылығы',
    answer: '👑 **Томирис — сақ-массагеттердің даңқты әйел патшайымы (б.з.д. VI ғ.)**.\n\n• **Тарихи шайқас:** Б.з.д. 530 жылы Парсы патшасы Кир II (Ұлы Кир) жаулап алу жорығымен Сырдария маңына басып кіреді.\n• **Нәтижесі:** Томирис бастаған сақ әскері парсылардың қалың қолын талқандап, Кирдің өзін өлтіреді. Ол Кирдің басын қан толтырылған торсыққа салып: *«Қанға құмартқан едің, енді шөліңді қанмен қандыр!»* деген әйгілі сөзді айтады.\n• **Тарихи мұрасы:** Бұл оқиға көшпелілердің еркіндікке сүйіспеншілігі мен Отан қорғау рухының символына айналды.',
  },
  {
    stems: ['алтын адам', 'есик', 'акышев', 'сак жауынгер', 'бас киим', '1969'],
    title: '«Алтын адам» — Сақ өркениетінің жауһары',
    answer: '🏆 **«Алтын адам» (Есік обасы)** — 1969 жылы Алматы облысы Есік қаласының маңында белгілі қазақ археологы **Кемал Ақышев** ашқан әлемдік сенсация.\n\n• **Дәуірі:** Б.з.д. V–IV ғасырлар (ерте сақ кезеңі).\n• **Ерекшелігі:** 17-18 жастағы сақ ханзадасы 4000-нан астам таза құйылған алтын әшекейлермен көмкерілген.\n• **Аң стилі:** Алтын пластиналар барыс, таутеке, бұлан, арқар және қанатты пырақ бейнелерінде (сақтардың аң стилінде) соғылған.\n• **Күміс тостаған:** Тостаған түбінде 26 таңбадан тұратын көне руналық сақ жазуы табылған — бұл сақтарда жазу өнері болғанының бұлтартпас дәлелі.',
  },
  {
    stems: ['каратау', 'палеолит', 'тас курал', 'шабакты', 'бифас', 'танирказган', 'бориказган'],
    title: 'Қаратау тұрақтары және Тас дәуірі',
    answer: '🪨 **Қаратау жотасының тұрақтары (Ерте палеолит)**:\n\n• **Мекендер:** Шабақты, Тәңірқазған, Бөріқазған, Қазанғап үңгірлері мен тұрақтарынан 5000-нан астам ең көне тас бұйымдары табылған.\n• **Құралдар:** Кремний мен кварцитті қашап жасалған екі жағы өңделген әмбебап қол шапқыштары (**бифастар**), қырғыштар мен өзектастар (нуклеустер).\n• **Маңызы:** Қазақстан аумағында алғашқы адамдар бұдан 800-500 мың жыл бұрын өмір сүргенін растайды.',
  },
  {
    stems: ['андрон', 'кола', 'бегазы', 'дандибай', 'мыс', 'металлургия', 'жезказган'],
    title: 'Андронов және Беғазы-Дәндібай мәдениеттері (Қола дәуірі)',
    answer: '⚱️ **Қола дәуірі (б.з.д. II – I мыңжылдықтың басы)**:\n\n• **Негізгі мәдениет:** Андронов мәдениеті. Орталық және Шығыс Қазақстан даласы мыс пен қалайы қорытудың ірі орталығы болды (Жезқазған, Кенқазған кен орындары).\n• **Өмір салты:** Бақташылық-егіншілік, күрделі дөңгелекті соғыс арбалары (күймелер), геометриялық ою-өрнекті қыш ыдыстар.\n• **Беғазы-Дәндібай:** Орталық Қазақстандағы монументалды тас кесенелерімен белгілі соңғы қола дәуірінің жоғары дамыған мәдениеті.',
  },
  {
    stems: ['жети жаргы', 'тауке', 'толе би', 'казыбек би', 'айтеке би', 'зан'],
    title: 'Тәуке хан және «Жеті Жарғы» заңдар кодексі',
    answer: '📜 **«Жеті Жарғы» (XVII ғ. соңы – XVIII ғ. басы)**:\n\n• **Авторы:** Әз Тәуке хан, атақты үш жүздің билерімен бірге: **Төле би** (Ұлы жүз), **Қазыбек би** (Орта жүз), **Әйтеке би** (Кіші жүз).\n• **Мазмұны:** Жер дауы, жесір дауы, құн төлеу, қылмыс жазалары, әскери тәртіп пен дипломатияны реттейтін 7 негізгі бап.\n• **Тарихи нәтиже:** Қазақ елінің ішкі бірлігін нығайтып, «қой үстіне бозторғай жұмыртқалаған» тыныш заман орнатты.',
  },
  {
    stems: ['абылай', 'жонгар', 'аныракай', 'орбулак', 'богенбай', 'кабанбай', 'актабан'],
    title: 'Ақтабан шұбырынды және Абылай хан дәуірі',
    answer: '🛡️ **Жоңғар шапқыншылығы және Қазақ батырлары**:\n\n• **Ақтабан шұбырынды (1723 жыл):** Жоңғарлардың тұтқиылдан шабуылы халықты ауыр қасіретке ұшыратты («Елім-ай» әні осы кезде туған).\n• **Орбұлақ шайқасы (1643 жыл):** Салқам Жәңгір хан мен Жалаңтөс батыр 600 сарбазбен жоңғардың 50 мыңдық қолына төтеп берген керемет тактикалық жеңіс.\n• **Аңырақай шайқасы (1729/1730):** Қазақ жасақтары бірігіп, жоңғар басқыншыларына шешуші соққы берді.\n• **Абылай хан:** Дипломатиялық шеберлігімен Қытай мен Ресей арасында тепе-теңдік сақтап, Қазақ хандығының аумақтық тұтастығын сақтап қалды.',
  },
  {
    stems: ['алаш', 'бокейхан', 'байтурсынулы', 'дулатулы', '1917', 'алашорда'],
    title: 'Алаш қозғалысы және Алашорда үкіметі (1917 жыл)',
    answer: '⭐ **Алаш арыстары және Алаш автономиясы (1917–1920)**:\n\n• **Көшбасшылары:** Әлихан Бөкейхан (үкімет төрағасы), Ахмет Байтұрсынұлы («Қазақ» газеті, тұңғыш әліппе), Міржақып Дулатұлы («Оян, қазақ!»).\n• **Ұраны:** Ұлттық мемлекеттілік, ғылым-білім, жер мен табиғи байлықты қазақ халқына қалдыру, өркениетті демократиялық қоғам құру.\n• **Ахмет сөзі:** *«Басқадан кем болмас үшін біз білімді, бай һәм күшті болуымыз керек. Білімді болуға оқу керек. Бай болуға кәсіп керек. Күшті болуға бірлік керек!»*',
  },
  {
    stems: ['тауелсиздик', '1991', '16 желтоксан', 'астана', 'рамиз', 'желтоксан', '1986'],
    title: 'Қазақстанның Мемлекеттік Тәуелсіздігі (1991 жыл)',
    answer: '🇰🇿 **Қазақстан Республикасының Тәуелсіздігі**:\n\n• **1986 жыл 16-17 желтоқсан:** Алматыдағы Желтоқсан көтерілісі (Қайрат Рысқұлбеков, Ләззат Асанова бастаған жастардың ерлігі).\n• **1991 жыл 16 желтоқсан:** «Қазақстан Республикасының Мемлекеттік тәуелсіздігі туралы» Конституциялық заң қабылданды.\n• **Мемлекеттік рәміздер (1992 жыл):** Көк туымыз (авторы: Шәкен Ниязбеков), Елтаңба (авторлары: Жандарбек Мәлібеков, Шота Уәлиханов).\n• **Тарихи сабақтастық:** Тәуелсіздік — Сақтардан, Түрік қағандығынан, Қазақ хандығы мен Алаш арыстарынан жалғасып келе жатқан бабалар арманының орындалуы.',
  },
  {
    stems: ['турик', 'кагандык', 'култегин', 'билге', 'бумын', 'мукан', 'орхон', '552'],
    title: 'Ұлы Түрік қағандығы (552–603 жж.)',
    answer: '🐺 **Түрік қағандығы (552–603 жж.)**:\n\n• **Құрылуы:** 552 жылы Бумын қаған Жетісу мен Алтайдан бастап Ұлы Даланы біріктірді.\n• **Мәдениеті:** Тұңғыш төл көне түрік (Орхон-Енисей) руна жазуы қалыптасты (Күлтегін, Білге қаған, Тоныкөк тас бітіктастары).\n• **Мұрасы:** «Мәңгілік ел» идеясы, түркі халықтарының тілдік, әскери және мемлекеттік негізін қалады.',
  },
  {
    stems: ['алтын орда', 'жошы', 'батый', 'берке', 'озбек', 'сарай'],
    title: 'Алтын Орда (Жошы Ұлысы)',
    answer: '🦅 **Алтын Орда (XIII–XV ғғ.)**:\n\n• **Негізін салушы:** Жошы хан мен оның ұлы Батый хан.\n• **Орталығы:** Еділ бойындағы Сарай-Бату, кейін Сарай-Берке қалалары.\n• **Ислам діні:** Өзбек ханның (1312–1341 жж.) тұсында ислам мемлекеттік дін болып бекітілді.\n• **Қазақ хандығымен байланысы:** Қазақ хандығы — Алтын Орданың тікелей мұрагері және саяси жалғасы болып табылады.',
  },
  {
    stems: ['гун', 'моде', 'аттила', '209'],
    title: 'Ғұн мемлекеті және Мөде қаған',
    answer: '🏹 **Ғұн мемлекеті (б.з.д. 209 ж. – б.з. IV ғ.)**:\n\n• **Мөде қаған (б.з.д. 209 ж.):** «Жер — мемлекеттің негізі, оны ешкімге беруге болмайды!» деп, көшпелілердің тұңғыш темірдей тәртіпке бағынған әскери империясын құрды.\n• **Аттила (Еділ патша):** Еуропаға дейін жорық жасап, Рим империясын тізе бүктірген атақты ғұн билеушісі.',
  }
];

const HISTORICAL_KB_EN = [
  {
    stems: ['khanate', 'kerei', 'zhanibek', '1465', 'steppe', 'foundation', 'when was'],
    title: 'Establishment of the Kazakh Khanate (1465)',
    answer: '⚔️ **The Kazakh Khanate was founded in 1465!**\n\n• **Founding Sultans:** Kerei Khan and Zhanibek Khan.\n• **Location:** The Chu and Kozybasy regions in Western Zhetysu.\n• **Significance:** Marked the official birth of the independent Kazakh state and the unification of Kazakh clans under their historic national identity.',
  },
  {
    stems: ['botai', 'horse', 'domestication', 'eneolithic'],
    title: 'Botai Culture & Earliest Horse Domestication',
    answer: '🐎 **Botai Culture (4th–3rd millennia BC)** — Located in Northern Kazakhstan (Aiyrtau district), this settlement is celebrated worldwide as the birthplace of horse domestication.\n\n• **Groundbreaking Discovery:** The earliest undisputed evidence of domesticated horses.\n• **Artifacts:** Over 300,000 horse bones, bit wear on premolars, and ceramic vessels containing traces of mare’s milk (koumiss).\n• **Global Impact:** Revolutionized mobility, herding, and trade across the Eurasian continent.',
  },
  {
    stems: ['tomyris', 'cyrus', 'saka', 'massagetae', 'persia', '530'],
    title: 'Queen Tomyris & the Victory over Cyrus',
    answer: '👑 **Queen Tomyris & The Massagetae Confederation (530 BC)**:\n\n• **Epic Battle:** Cyrus the Great of the Persian Achaemenid Empire invaded the Syr Darya steppe with a massive army.\n• **Outcome:** Queen Tomyris rallied nomadic warriors, routed the Persian forces, and killed Cyrus.\n• **Legacy:** Her defense symbolizes nomadic sovereignty, bravery, and leadership of women in Saka society.',
  },
  {
    stems: ['golden man', 'issyk', 'kurgan', 'gold', 'warrior', '1969'],
    title: 'The Golden Man of Issyk Kurgan',
    answer: '🏆 **The Golden Man (Discovered 1969)**:\n\n• **Archaeologist:** Kemal Akishev near Issyk, Almaty region.\n• **Era:** 5th–4th century BC (Early Saka age).\n• **Splendor:** An 18-year-old warrior prince adorned in over 4,000 pure gold ornaments portraying leopards, argali, and mythical creatures in the Steppe Animal Style.\n• **Silver Cup Inscription:** Features 26 runes confirming an early Saka written script.',
  }
];

export default function AITutorPage() {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'kk';

  // Persistence Key
  const STORAGE_KEY = 'qazhistory_ai_chat_v2';

  const defaultWelcomeMessage = {
    id: 'welcome-01',
    sender: 'ai',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    title: lang === 'en' ? 'Greetings, Seeker of Knowledge!' : 'Армысың, Жас Ұлан!',
    text: lang === 'en'
      ? 'Welcome to the AI Steppe Historian! Ask me anything about Kazakhstan’s deep past: from the Botai horse domesticators and Queen Tomyris, to the Golden Man, Kazakh Khanate, and Independence. What historical era shall we explore today?'
      : 'Қош келдің! Мен — Қазақстан тарихының цифрлық зерттеушісі, сенің виртуалды AI Тәлімгеріңмін. Ботай мәдениеті, Сақ жауынгерлері, Томирис пен Кир шайқасы, Алтын Адам құпиясы немесе Қазақ хандығы қашан құрылғаны туралы кез келген сұрағыңды қой! Бүгін қандай тарихи оқиғаны зерттейміз?',
  };

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return [defaultWelcomeMessage];
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Gemini API Key State (reads silently from env/storage)
  const apiKey = getGeminiApiKey();

  const messagesEndRef = useRef(null);

  // Auto-scroll when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Persist messages to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [messages]);

  const quickPrompts = lang === 'en' ? [
    { label: '🐎 Botai & Horses', query: 'Tell me about the Botai culture and horse domestication.' },
    { label: '👑 Queen Tomyris', query: 'Who was Queen Tomyris and how did she defeat Cyrus?' },
    { label: '🏆 The Golden Man', query: 'What is the secret of the Issyk Golden Man?' },
    { label: '⚔️ Kazakh Khanate (1465)', query: 'When and how was the Kazakh Khanate established?' },
    { label: '📜 Tauke Khan Laws', query: 'Tell me about Tauke Khan and the Zheti Zhargy.' },
    { label: '⭐ Alash Orda', query: 'Who were the leaders of the Alash movement in 1917?' },
  ] : [
    { label: '⚔️ Қазақ хандығы қашан құрылды?', query: 'Қазақ хандығы қашан құрылды?' },
    { label: '🐎 Ботай және жылқы', query: 'Ботай мәдениеті туралы толық айтып берші.' },
    { label: '👑 Томирис пен Кир', query: 'Томирис патшайым Кирді қалай жеңді?' },
    { label: '🏆 Алтын Адам құпиясы', query: 'Есік қорғанындағы Алтын адам қашан және қалай табылды?' },
    { label: '📜 Тәуке ханның Жеті Жарғысы', query: 'Жеті Жарғы заңдар жинағы туралы баяндап берші.' },
    { label: '⭐ Алаш арыстары', query: 'Алаш қозғалысының көсемдері кімдер болды?' },
    { label: '🇰🇿 Тәуелсіздік тарихы', query: '1991 жылғы Тәуелсіздік туралы айтып берші.' },
  ];

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    sounds.playTap?.();

    const newMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    // 1. Check if Real Gemini API Key is configured
    if (apiKey) {
      try {
        const geminiResponse = await askGeminiAPI(query, messages, lang);
        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: lang === 'en' ? '⚡ Gemini 1.5 Flash AI' : '⚡ Gemini 1.5 Flash AI',
          text: geminiResponse,
          isLiveAI: true,
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        sounds.playCorrect?.();
        return;
      } catch (err) {
        console.warn('Live Gemini API call failed, falling back to smart local KB:', err);
      }
    }

    // 2. Intelligent Offline Fallback with Normalized Kazakh Phonetic Search
    setTimeout(() => {
      const qNorm = normalizeQuery(query);
      const kb = lang === 'en' ? HISTORICAL_KB_EN : HISTORICAL_KB_KK;

      // Find best match by checking normalized stems
      let matchedEntry = kb.find((item) =>
        item.stems.some((stem) => {
          const normStem = normalizeQuery(stem);
          return qNorm.includes(normStem) || normStem.includes(qNorm);
        })
      );

      let responseText = '';
      let responseTitle = '';

      if (matchedEntry) {
        responseText = matchedEntry.answer;
        responseTitle = matchedEntry.title;
      } else {
        if (lang === 'en') {
          responseText = `📖 **Historical Note regarding "${query}"**:\n\nThank you for asking! While I am currently accessing our Steppe Historical Archive, this query touches upon rich historical context.\n\nYou can explore our quick topic chips above (Kazakh Khanate, Botai, Tomyris, Golden Man, Alash) or ask a specific question!`;
          responseTitle = 'Steppe Archive';
        } else {
          responseText = `📖 **«${query}» туралы тарихи анықтама**:\n\nСұрағыңызға рақмет! Бұл мәселе Қазақстанның мыңжылдық бай тарихымен тығыз байланысты.\n\nМенің қорымда Ботай энеолиті, Сақтар мен Томирис, Алтын адам, Түрік қағандығы, Алтын Орда, Қазақ хандығының құрылуы (1465 ж.), Абылай хан және Алаш Орда бойынша толық жауаптар бар.\n\n💡 **Кеңес:** Сұрақты нақтылап көріңіз немесе жоғарыдағы жылдам тақырып батырмаларын басыңыз! 🐎`;
          responseTitle = 'Тарихи анықтамалық';
        }
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: responseTitle,
        text: responseText,
        isLiveAI: false,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      sounds.playCorrect?.();
    }, 600);
  };

  const handleClearHistory = () => {
    if (window.confirm(lang === 'en' ? 'Clear conversation history?' : 'Барлық сұрақ-жауап тарихын өшіруді қалайсыз ба?')) {
      setMessages([defaultWelcomeMessage]);
      localStorage.removeItem(STORAGE_KEY);
      sounds.playTap?.();
    }
  };

  const handleSpeak = (msgId, text) => {
    if (activeSpeakingId === msgId) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setActiveSpeakingId(null);
      return;
    }
    setActiveSpeakingId(msgId);
    const cleanText = text.replace(/[*_#`~•]/g, ' ');
    sounds.speakText(cleanText, lang === 'en' ? 'en-US' : 'kk-KZ');

    setTimeout(() => {
      setActiveSpeakingId(null);
    }, 12000);
  };

  const handleCopy = (msgId, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-[calc(100vh-5rem)] pb-4">
      {/* ━━━━━━━━━━━━━━━━━━━━━ 1. HEADER BAR ━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-surface-container shadow-xs mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-[#46a302] text-on-primary flex items-center justify-center shadow-md border-2 border-white/60">
            <span className="material-symbols-outlined text-2xl material-symbols-filled">psychology</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-headline text-lg sm:text-xl font-black text-on-surface">
                {lang === 'en' ? 'AI Tarihshy • Steppe Historian' : 'AI Тарихшы • Интерактивті Тәлімгер'}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {lang === 'en' ? 'Active' : 'Белсенді • Онлайн'}
              </span>
            </div>
            <p className="font-body text-xs text-on-surface-variant font-medium">
              {lang === 'en'
                ? 'Your personal digital scholar for Kazakhstan history (History persisted)'
                : 'Қазақстан тарихы бойынша виртуалды ғылыми көмекші (Диалог сақталады)'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Clear Chat Button */}
          <button
            type="button"
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-error-container/20 text-on-surface-variant hover:text-error text-xs font-bold transition-all cursor-pointer shadow-xs"
            title={lang === 'en' ? 'Clear chat history' : 'Чат тарихын тазарту'}
          >
            <span className="material-symbols-outlined text-sm">delete</span>
            <span className="hidden sm:inline">{lang === 'en' ? 'Clear' : 'Тазарту'}</span>
          </button>
        </div>
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━ 2. CHAT CONVERSATION VIEWPORT ━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex-1 overflow-y-auto px-1 py-2 space-y-4 pr-2">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'} animate-fadeIn`}
            >
              {/* AI Avatar */}
              {isAI && (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0 border border-white">
                  🐆
                </div>
              )}

              {/* Message Bubble Card */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 shadow-[0_2px_0_0_#dcdad2] transition-all ${
                  isAI
                    ? 'bg-surface-container-lowest text-on-surface border border-surface-container rounded-tl-sm'
                    : 'bg-primary text-on-primary rounded-tr-sm shadow-[0_4px_0_0_#46a302]'
                }`}
              >
                {/* Header info in AI message */}
                {isAI && msg.title && (
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-surface-container-low">
                    <span className="font-headline text-xs font-extrabold text-primary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">auto_stories</span>
                      {msg.title}
                    </span>
                    <span className="text-[10px] text-outline font-semibold">{msg.timestamp}</span>
                  </div>
                )}

                {/* Body Content */}
                <div className="font-body text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </div>

                {/* AI Footer Tools: Listen voice, Copy */}
                {isAI && (
                  <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-surface-container-low text-[11px] text-on-surface-variant font-bold">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          activeSpeakingId === msg.id
                            ? 'bg-primary text-on-primary shadow-xs'
                            : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {activeSpeakingId === msg.id ? 'stop_circle' : 'volume_up'}
                        </span>
                        <span>
                          {activeSpeakingId === msg.id
                            ? (lang === 'en' ? 'Stop' : 'Тоқтату')
                            : (lang === 'en' ? 'Listen' : 'Тыңдау')}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {copiedId === msg.id ? 'check' : 'content_copy'}
                        </span>
                        <span>
                          {copiedId === msg.id
                            ? (lang === 'en' ? 'Copied' : 'Көшірілді')
                            : (lang === 'en' ? 'Copy' : 'Көшіру')}
                        </span>
                      </button>
                    </div>

                    <span className="text-[10px] text-outline">
                      {msg.isLiveAI ? '⚡ Gemini 1.5' : 'QAZHISTORY AI'}
                    </span>
                  </div>
                )}

                {/* User message timestamp */}
                {!isAI && (
                  <div className="text-right text-[10px] text-white/80 font-bold mt-1">
                    {msg.timestamp}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {!isAI && (
                <div className="w-10 h-10 rounded-2xl bg-secondary-container text-on-secondary-container font-black text-sm flex items-center justify-center shadow-sm shrink-0 border border-white">
                  👤
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-3 animate-fadeIn">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🐆
            </div>
            <div className="bg-surface-container-lowest border border-surface-container rounded-2xl px-4 py-3 shadow-[0_2px_0_0_#dcdad2] flex items-center gap-2 text-xs font-bold text-on-surface-variant">
              <span>{apiKey ? (lang === 'en' ? 'Gemini AI is generating...' : 'Шын Gemini AI жауап әзірлеп жатыр...') : (lang === 'en' ? 'Historian is thinking...' : 'AI Тарихшы жауап жазып жатыр...')}</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━ 3. QUICK TOPIC CHIPS ━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="pt-2 pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(p.query)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-surface-container-lowest hover:bg-primary hover:text-on-primary border border-surface-container text-xs font-bold text-on-surface transition-all cursor-pointer shadow-xs shrink-0 active:scale-95"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━ 4. INPUT PROMPT BOX ━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-surface-container-lowest rounded-2xl p-2 sm:p-2.5 border border-surface-container shadow-sm flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={
            lang === 'en'
              ? 'Ask any question (e.g. "When was the Kazakh Khanate founded?", "Who was Tomyris?")...'
              : 'Қазақстан тарихынан кез келген сұрақ қойыңыз (мысалы: "Қазақ хандығы қашан құрылды?")...'
          }
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm font-body text-on-surface focus:outline-hidden placeholder:text-outline"
        />

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          className={`h-11 px-4 rounded-xl font-headline font-black text-xs flex items-center gap-1.5 transition-all shadow-[0_3px_0_0_#46a302] active:translate-y-1 active:shadow-none cursor-pointer ${
            inputText.trim()
              ? 'bg-primary text-on-primary hover:bg-primary-container'
              : 'bg-surface-container-high text-outline opacity-60 cursor-not-allowed shadow-none'
          }`}
        >
          <span className="hidden sm:inline">{lang === 'en' ? 'Send' : 'Жіберу'}</span>
          <span className="material-symbols-outlined text-lg">arrow_upward</span>
        </button>
      </div>
    </div>
  );
}
