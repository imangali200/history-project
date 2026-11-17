import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import sounds from '../utils/audio';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. FLASHCARDS DATA (Rich Steppe History Deck)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const FLASHCARDS = [
  {
    id: 1,
    category: 'botai',
    front: 'Ботай мәдениеті',
    frontEn: 'Botai Culture',
    sub: 'Б.з.д. 3700–3100 жж. • Солтүстік Қазақстан',
    subEn: '3700–3100 BC • North Kazakhstan',
    back: 'Әлем тарихында алғаш рет жабайы жылқы қолға үйретілген өркениет бесігі. Қыш ыдыстардан қымыздың май қышқылдары табылды.',
    backEn: 'The cradle of civilization that domesticated the horse for the first time in world history. Traces of mare milk (kumis) were discovered on pottery.',
    icon: 'pets',
    tag: 'Энеолит / Eneolithic',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr-o5InUQ7wpcM3tXLeQZwaIagNkyLiuPYZJvGCF6lkOBch_S4iN3Har8O-fuv9l8GtT1mffuhu3L4pZu15-7b-jdkxViz-mQZzEEz-Cglvj1K1Af0NIhIXZmrVu9nsLrvykmHzP8HguFaeTA0dO97ORYDtLmHEQU3hyqPDixOixH0qbFr7SfuWRPuS-GwxXW3DG6OJ5FJyjKwcQj5iD4y0o1bSDN5yYKDKJ0oI77c',
    audioText: 'Ботай мәдениеті. Б.з.д. 4-мыңжылдықта Солтүстік Қазақстанда әлемде алғаш рет жылқыны қолға үйреткен өркениет.'
  },
  {
    id: 2,
    category: 'saka',
    front: 'Есік «Алтын Адамы»',
    frontEn: 'Issyk Golden Man',
    sub: '1969 ж. • Алматы облысы, Есік қорғаны',
    subEn: '1969 • Almaty Region, Issyk Kurgan',
    back: '4000-нан астам таза алтын әшекеймен көмкерілген сақ жауынгері. Тәжінде қанатты пырақтар мен аң стилінің ғажайып үлгілері бейнеленген.',
    backEn: 'A Saka prince warrior adorned with over 4,000 pure gold ornaments, showcasing the peak of steppe animal-style jewelry art.',
    icon: 'military_tech',
    tag: 'Сақ дәуірі / Saka Era',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJhrbzOkJskEfaR8Inhc3xyl09WbCvzbAK9ywutGqLC72r-60CjM1CX7rgQSFbNVb2ZVhJko81AJIc0Y9kz5Q73oQbds_Pnk2CrAX5QEN6XehIir-K1U3c13dofbxnhefqaCH51dOji1__WC2bT1evOlMgBSeBReS4_HFITGAyuAec8AKeNw-iDeTSc5mIJ5OpenUptHTCVqJpMk6rMw8-idbxxLllym4eGCvLggpN',
    audioText: 'Есік Алтын Адамы. 1969 жылы табылған, төрт мыңнан астам алтын бұйыммен көмкерілген сақ көсемі.'
  },
  {
    id: 3,
    category: 'saka',
    front: 'Томирис патшайым',
    frontEn: 'Queen Tomyris',
    sub: 'Б.з.д. 530 жыл • Массагеттер билеушісі',
    subEn: '530 BC • Ruler of Massagetae',
    back: 'Парсы патшасы Кирдің басқыншы әскерін талқандап, Ұлы Дала тәуелсіздігін қорғап қалған ержүрек дала көсемі.',
    backEn: 'Heroic steppe queen who defeated the invading Persian King Cyrus the Great to preserve nomadic freedom.',
    icon: 'shield',
    tag: 'Тарихи тұлға / Historic Figure',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhzBrqdfCKJjaZrYtdklNWEgza2hSCheXM4ssLHdJmeyDwd9ocTpwvI29oPgzzkBHrfevdr4xJ2c7usISgbkamh9E4fJJnHidNtqLFEUT7oUxXsO-5kH4cC1r-UgccHFCNQD0BlRyEgHQjCS_iFaxfNad7tSu9oSJ20yuanoQJ2CfLYjt8EQkfUhCBl3TdTp5LRSieuNOKbmZ5gMlGINplpFIKmeTU4MV4yK8xG2IK',
    audioText: 'Томирис патшайым. Б.з.д. 530 жылы парсы патшасы Кирдің әскерін талқандаған массагеттердің ержүрек билеушісі.'
  },
  {
    id: 4,
    category: 'saka',
    front: 'Ақинақ (Akinakes)',
    frontEn: 'Akinakes Short Dagger',
    sub: 'Сақтардың қасиетті қанжары',
    subEn: 'Sacred Saka Dagger',
    back: 'Көшпелі сақ жауынгерлерінің негізгі қаруы (ұзындығы 40-60 см). Барыс, арқар және жыртқыш құстар бейнесімен нақышталған.',
    backEn: 'Primary close-combat weapon of Saka warriors (40-60 cm), embellished with predatory animal motifs.',
    icon: 'swords',
    tag: 'Қару-жарақ / Weaponry',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVU4CykVnSbkU-S6fAxBCIg_36UCmNOhOmv3FIqNb7FqDSHoNx7sGsWE2duANgNBXxHEdueEZLUdTrzSVnVUPv9pjDd78Jm6sMMslbZrbQc2omeZ1_KaObOwFLR_ZBnAim6zssY_8gIcZZuldj-g3_-VkZ0yAqu39dxvaJN2oTftxe821qmdbEpB-wEiL7Q2u2Be1Z9sgwiAeiIPA9P_Zfo_h7Eod6310mxVlOICGZ',
    audioText: 'Ақинақ қанжары. Сақ жауынгерлерінің аң стилімен әшекейленген қысқа семсері.'
  },
  {
    id: 5,
    category: 'saka',
    front: 'Күміс тостаған жазуы',
    frontEn: 'Issyk Silver Cup Inscription',
    sub: '26 таңбалы көне сақ жазуы',
    subEn: '26-glyph Ancient Saka Script',
    back: 'Есік обасынан табылған бұл жәдігер көшпелілерде б.з.д. V ғасырда-ақ өз жазу мәдениеті болғанын дүние жүзіне дәлелдеді.',
    backEn: 'Proven that Saka steppe nomads possessed their own runic/alphabetic written script as early as the 5th century BC.',
    icon: 'history_edu',
    tag: 'Жазу мәдениеті / Ancient Script',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfdNliMcSV1cQjfsmahch4bEAQStbMfekoXqkyhpipHcO2c3qEtGLQituPPrTBn4mvUtVlKh5Au6D85qDD6fKI7Q2L-OidqYnaoVj0Tl5Kcdf25rZNEIEFpbkCBKIObiXz_-TnIcUCUI8Q4yU4lso24owCy3-ebC2IowDBxwTMlZSvYkagCaOhWW1GyP5TLpH8SM15MielspVXiPmlopr97sk-UPGz-WhJVKBgF1yu',
    audioText: 'Күміс тостағандағы 26 таңбалы сақ жазуы. Көшпелілердің төл жазу мәдениетінің айғағы.'
  },
  {
    id: 6,
    category: 'khanate',
    front: 'Қазақ хандығының құрылуы',
    frontEn: 'Founding of the Kazakh Khanate',
    sub: '1465 жыл • Шу мен Қозыбасы',
    subEn: '1465 AD • Chu & Kozybasy',
    back: 'Керей мен Жәнібек хандардың бастауымен құрылған тұңғыш дербес мемлекет. Халқымыз «Қазақ» атауымен тұтас ұлт болып бірікті.',
    backEn: 'The first independent Kazakh state founded under Sultans Kerei and Zhanibek, unifying steppe tribes.',
    icon: 'flag',
    tag: 'Хандық дәуірі / Khanate Era',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJhrbzOkJskEfaR8Inhc3xyl09WbCvzbAK9ywutGqLC72r-60CjM1CX7rgQSFbNVb2ZVhJko81AJIc0Y9kz5Q73oQbds_Pnk2CrAX5QEN6XehIir-K1U3c13dofbxnhefqaCH51dOji1__WC2bT1evOlMgBSeBReS4_HFITGAyuAec8AKeNw-iDeTSc5mIJ5OpenUptHTCVqJpMk6rMw8-idbxxLllym4eGCvLggpN',
    audioText: 'Қазақ хандығының құрылуы. 1465 жылы Керей мен Жәнібек хандардың бастауымен құрылған тұңғыш дербес мемлекет.'
  }
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. MATCH PAIRS DATA (Duolingo Match Madness Game)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const INITIAL_MATCH_PAIRS = [
  { id: 'p1', left: 'Ботай мәдениеті', right: 'Тұңғыш жылқыны қолға үйрету' },
  { id: 'p2', left: 'Томирис патшайым', right: 'Парсы патшасы Кирді жеңді' },
  { id: 'p3', left: 'Есік қорғаны (1969)', right: '4000 алтынды «Алтын Адам»' },
  { id: 'p4', left: 'Кемал Ақышев', right: 'Алтын Адамды тапқан археолог' },
  { id: 'p5', left: '1465 жыл', right: 'Қазақ хандығының құрылуы' },
  { id: 'p6', left: 'Ақинақ', right: 'Сақ жауынгерінің семсер-қанжары' },
  { id: 'p7', left: '«Жеті Жарғы»', right: 'Тәуке ханның заңдар кодексі' },
  { id: 'p8', left: '1991 жыл 16 желтоқсан', right: 'ҚР Мемлекеттік Тәуелсіздігі' },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. BLITZ SPRINT DATA (60-sec True/False Speed Run)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const BLITZ_QUESTIONS = [
  {
    q: 'Адамзат тарихында жылқы алғаш рет Қазақстанның Ботай мәдениетінде қолға үйретілді.',
    isTrue: true,
    note: 'Дұрыс! 300 000-нан астам жылқы сүйегі мен қымыз қалдықтары табылған.'
  },
  {
    q: 'Есік обасынан табылған «Алтын адам» 100 000 алтын әшекеймен көмкерілген.',
    isTrue: false,
    note: 'Қате! Алтын адамда 4000-нан астам таза алтын бұйым табылған.'
  },
  {
    q: 'Б.з.д. 530 жылы Томирис патшайым Парсы патшасы Кирдің әскерін талқандады.',
    isTrue: true,
    note: 'Дұрыс! Массагеттер Ұлы Дала бостандығын ерлікпен қорғап қалды.'
  },
  {
    q: 'Қазақ хандығы 1723 жылы құрылды.',
    isTrue: false,
    note: 'Қате! Қазақ хандығы 1465 жылы құрылған. Ал 1723 жыл — «Ақтабан шұбырынды».'
  },
  {
    q: 'Есік күміс тостағанында 26 таңбадан тұратын сақ руналық жазуы табылған.',
    isTrue: true,
    note: 'Дұрыс! Бұл көшпелілердің б.з.д. V ғ. жазуы болғанын дәлелдейді.'
  },
  {
    q: '«Жеті Жарғы» заңдар жинағын Қасым хан жазған.',
    isTrue: false,
    note: 'Қате! «Жеті Жарғы» Тәуке ханның заңы. Ал Қасымдікі — «Қасым ханның қасқа жолы».'
  },
  {
    q: 'Орбұлақ шайқасында Салқам Жәңгір хан 600 сарбазбен 50 мың жоңғар әскеріне төтеп берді.',
    isTrue: true,
    note: 'Дұрыс! 1643 жылы Жалаңтөс батыр көмекке келіп, даңқты жеңіске жетті.'
  }
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. ARTIFACTS GALLERY DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ARTIFACTS = [
  {
    id: 'art-1',
    name: 'Алтын Адамның тәжі мен қанатты тұлпарлары',
    nameEn: 'Golden Man Crown & Winged Steeds',
    era: 'Б.з.д. V–IV ғғ.',
    eraEn: '5th–4th c. BC',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJhrbzOkJskEfaR8Inhc3xyl09WbCvzbAK9ywutGqLC72r-60CjM1CX7rgQSFbNVb2ZVhJko81AJIc0Y9kz5Q73oQbds_Pnk2CrAX5QEN6XehIir-K1U3c13dofbxnhefqaCH51dOji1__WC2bT1evOlMgBSeBReS4_HFITGAyuAec8AKeNw-iDeTSc5mIJ5OpenUptHTCVqJpMk6rMw8-idbxxLllym4eGCvLggpN',
    desc: 'Биіктігі 70 см-ге жуық сақ шошақ төбелі бөрігі. Тәждегі алтын қанатты пырақтар көшпелілердің Күн мен Тәңірге табынуын бейнелейді.',
    descEn: 'A 70 cm conical gold-decorated headdress symbolizing solar power and steppe sovereignty.',
    fact: 'Қазақстанның Мемлекеттік Елтаңбасындағы қанатты пырақтар осы Есік Алтын Адамынан алынған!'
  },
  {
    id: 'art-2',
    name: 'Ботай керамикалық қыш құмырасы',
    nameEn: 'Botai Ceramic Pottery',
    era: 'Б.з.д. IV мыңжылдық',
    eraEn: '4th millennium BC',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr-o5InUQ7wpcM3tXLeQZwaIagNkyLiuPYZJvGCF6lkOBch_S4iN3Har8O-fuv9l8GtT1mffuhu3L4pZu15-7b-jdkxViz-mQZzEEz-Cglvj1K1Af0NIhIXZmrVu9nsLrvykmHzP8HguFaeTA0dO97ORYDtLmHEQU3hyqPDixOixH0qbFr7SfuWRPuS-GwxXW3DG6OJ5FJyjKwcQj5iD4y0o1bSDN5yYKDKJ0oI77c',
    fallbackIcon: 'coffee',
    desc: 'Бұл құмыра қабырғаларында май қышқылдары мен бие сүтінің молекулалары сақталған, бұл адамзат тарихындағы алғашқы қымызды дәлелдейді.',
    descEn: 'Chemical lipid analysis of this pottery confirmed the earliest mare milk consumption in human history.',
    fact: 'Ботайда барлығы 300 000-нан астам жылқы сүйегі мен жүздеген мың қыш сынықтары табылған.'
  },
  {
    id: 'art-3',
    name: 'Сақ Ақинағы — Алтын қынапты қанжар',
    nameEn: 'Golden Saka Akinakes Dagger',
    era: 'Б.з.д. VI–V ғғ.',
    eraEn: '6th–5th c. BC',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVU4CykVnSbkU-S6fAxBCIg_36UCmNOhOmv3FIqNb7FqDSHoNx7sGsWE2duANgNBXxHEdueEZLUdTrzSVnVUPv9pjDd78Jm6sMMslbZrbQc2omeZ1_KaObOwFLR_ZBnAim6zssY_8gIcZZuldj-g3_-VkZ0yAqu39dxvaJN2oTftxe821qmdbEpB-wEiL7Q2u2Be1Z9sgwiAeiIPA9P_Zfo_h7Eod6310mxVlOICGZ',
    fallbackIcon: 'colorize',
    desc: 'Таза алтынмен қапталған семсер қынабында 21 түрлі аң-құс бейнесі (барыс, арқар, таутекенің шайқасы) динамикалық түрде соғылған.',
    descEn: 'The pure gold scabbard depicts 21 ferocious steppe animals locked in ritual combat.',
    fact: 'Аң стилі (Animal style) көшпелілердің батылдығы мен табиғатпен үндестігінің символы болған.'
  }
];

export default function PracticePage() {
  const { i18n } = useTranslation();
  const { user, addXp, refillHearts } = useAuth();
  const navigate = useNavigate();
  const lang = i18n.language === 'en' ? 'en' : 'kk';

  // Active Hub Tab: 'flashcards' | 'match' | 'blitz' | 'artifacts' | 'refill'
  const [activeTab, setActiveTab] = useState('flashcards');

  // Flashcards state
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [isDeckCompleted, setIsDeckCompleted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filtered Flashcards
  const filteredCards = selectedCategory === 'all'
    ? FLASHCARDS
    : FLASHCARDS.filter(c => c.category === selectedCategory);

  const safeCardIdx = Math.min(currentCardIdx, Math.max(0, filteredCards.length - 1));
  const currentCard = filteredCards[safeCardIdx] || FLASHCARDS[0];

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MATCH MADNESS STATE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const [matchLeftItems, setMatchLeftItems] = useState([]);
  const [matchRightItems, setMatchRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [wrongPair, setWrongPair] = useState(false);
  const [matchStreak, setMatchStreak] = useState(0);
  const [matchCompleted, setMatchCompleted] = useState(false);

  // Initialize Match Game
  const startMatchGame = () => {
    const shuffledPairs = [...INITIAL_MATCH_PAIRS].sort(() => 0.5 - Math.random()).slice(0, 5);
    const lefts = shuffledPairs.map(p => ({ id: p.id, text: p.left })).sort(() => 0.5 - Math.random());
    const rights = shuffledPairs.map(p => ({ id: p.id, text: p.right })).sort(() => 0.5 - Math.random());
    setMatchLeftItems(lefts);
    setMatchRightItems(rights);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds(new Set());
    setMatchStreak(0);
    setMatchCompleted(false);
    setWrongPair(false);
  };

  useEffect(() => {
    if (activeTab === 'match') {
      startMatchGame();
    }
  }, [activeTab]);

  // Handle Match Selection
  const handleSelectLeft = (item) => {
    if (matchedIds.has(item.id)) return;
    sounds.playTap?.();
    setSelectedLeft(item);

    if (selectedRight) {
      checkMatchPair(item.id, selectedRight.id);
    }
  };

  const handleSelectRight = (item) => {
    if (matchedIds.has(item.id)) return;
    sounds.playTap?.();
    setSelectedRight(item);

    if (selectedLeft) {
      checkMatchPair(selectedLeft.id, item.id);
    }
  };

  const checkMatchPair = (leftId, rightId) => {
    if (leftId === rightId) {
      // Correct Match!
      sounds.playCorrect?.();
      const updated = new Set(matchedIds);
      updated.add(leftId);
      setMatchedIds(updated);
      setSelectedLeft(null);
      setSelectedRight(null);
      setMatchStreak(prev => prev + 1);

      if (updated.size === matchLeftItems.length) {
        setMatchCompleted(true);
        sounds.playFanfare?.();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        addXp(30);
      }
    } else {
      // Wrong Match
      sounds.playWrong?.();
      setWrongPair(true);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrongPair(false);
      }, 700);
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BLITZ SPRINT STATE (60-sec True/False Run)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const [blitzIdx, setBlitzIdx] = useState(0);
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzTimeLeft, setBlitzTimeLeft] = useState(45);
  const [blitzActive, setBlitzActive] = useState(false);
  const [blitzFinished, setBlitzFinished] = useState(false);
  const [blitzFeedback, setBlitzFeedback] = useState(null);

  const startBlitz = () => {
    setBlitzIdx(0);
    setBlitzScore(0);
    setBlitzTimeLeft(45);
    setBlitzActive(true);
    setBlitzFinished(false);
    setBlitzFeedback(null);
    sounds.playTap?.();
  };

  useEffect(() => {
    let timer;
    if (blitzActive && blitzTimeLeft > 0) {
      timer = setInterval(() => {
        setBlitzTimeLeft((prev) => {
          if (prev <= 1) {
            setBlitzActive(false);
            setBlitzFinished(true);
            sounds.playFanfare?.();
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            addXp(20);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [blitzActive, blitzTimeLeft]);

  const handleBlitzAnswer = (userChoice) => {
    if (!blitzActive || blitzFeedback) return;

    const currentQ = BLITZ_QUESTIONS[blitzIdx];
    const isCorrect = userChoice === currentQ.isTrue;

    if (isCorrect) {
      sounds.playCorrect?.();
      setBlitzScore((prev) => prev + 1);
      setBlitzFeedback({ correct: true, note: currentQ.note });
    } else {
      sounds.playWrong?.();
      setBlitzFeedback({ correct: false, note: currentQ.note });
    }

    setTimeout(() => {
      setBlitzFeedback(null);
      if (blitzIdx + 1 < BLITZ_QUESTIONS.length) {
        setBlitzIdx((prev) => prev + 1);
      } else {
        setBlitzActive(false);
        setBlitzFinished(true);
        sounds.playFanfare?.();
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
        addXp(25);
      }
    }, 1100);
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // HEART REFILL QUIZ STATE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const [refillQuestionIdx, setRefillQuestionIdx] = useState(0);
  const [refillScore, setRefillScore] = useState(0);
  const [refillSelected, setRefillSelected] = useState(null);
  const [refillDone, setRefillDone] = useState(false);

  const REFILL_QUESTIONS = [
    {
      q: 'Дүние жүзінде жылқы алғаш қай мәдениетте қолға үйретілді?',
      qEn: 'In which culture was the horse first domesticated in human history?',
      options: ['Ботай мәдениеті', 'Андронов мәдениеті', 'Мысыр өркениеті', 'Шумер елі'],
      correct: 0
    },
    {
      q: 'Есік қорғанынан табылған Алтын адам қанша алтын әшекеймен безендірілген?',
      qEn: 'How many gold ornaments adorned the Issyk Golden Man?',
      options: ['4000-нан астам', '500 дана', '100 дана', '10 000 дана'],
      correct: 0
    },
    {
      q: 'Сақтардың парсы басқыншысы Кирге қарсы күресін кім басқарды?',
      qEn: 'Who led the Saka against the Persian invader King Cyrus?',
      options: ['Томирис патшайым', 'Зарина патшайым', 'Аттила қаған', 'Керей хан'],
      correct: 0
    }
  ];

  const handleRefillAnswer = (optIdx) => {
    if (refillSelected !== null) return;
    setRefillSelected(optIdx);

    const isCorrect = optIdx === REFILL_QUESTIONS[refillQuestionIdx].correct;
    if (isCorrect) {
      sounds.playCorrect?.();
      setRefillScore((prev) => prev + 1);
    } else {
      sounds.playWrong?.();
    }

    setTimeout(() => {
      setRefillSelected(null);
      if (refillQuestionIdx + 1 < REFILL_QUESTIONS.length) {
        setRefillQuestionIdx((prev) => prev + 1);
      } else {
        setRefillDone(true);
        sounds.playFanfare?.();
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
        refillHearts();
        addXp(25);
      }
    }, 1000);
  };

  const handleSpeak = (text) => {
    sounds.speakText(text, lang === 'en' ? 'en-US' : 'kk-KZ');
  };

  // Flashcard Next & Prev
  const handleNextCard = (mastered = false) => {
    if (mastered) {
      setMasteredCount((prev) => prev + 1);
      sounds.playCorrect?.();
      addXp(5);
    } else {
      sounds.playTileMatch?.();
    }
    setIsFlipped(false);
    if (safeCardIdx + 1 < filteredCards.length) {
      setCurrentCardIdx(safeCardIdx + 1);
    } else {
      setIsDeckCompleted(true);
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
      sounds.playFanfare?.();
      addXp(25);
    }
  };

  const handlePrevCard = () => {
    if (safeCardIdx > 0) {
      setIsFlipped(false);
      setCurrentCardIdx(safeCardIdx - 1);
      sounds.playTileMatch?.();
    }
  };

  const handleRestartDeck = () => {
    setCurrentCardIdx(0);
    setIsFlipped(false);
    setMasteredCount(0);
    setIsDeckCompleted(false);
    sounds.playTileMatch?.();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* ━━━━━━━━━━━━━━━━━━━━━ 1. HERO & STATS HUD ━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-gradient-to-r from-primary via-[#46a302] to-primary-container rounded-3xl p-5 sm:p-6 text-on-primary shadow-[0_6px_0_0_#337801] mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-white/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-secondary-fixed font-headline text-xs font-black uppercase tracking-wider mb-2 border border-white/10">
            <span className="material-symbols-outlined text-sm">fitness_center</span>
            <span>{lang === 'en' ? 'Steppe Training Dojo' : 'Ұлы Дала Жаттығу Орталығы'}</span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'en' ? 'Interactive Steppe Practice' : 'Тарихты Интерактивті Қайталау'}
          </h1>
          <p className="font-body text-xs sm:text-sm text-white/90 font-medium mt-1 max-w-lg">
            {lang === 'en'
              ? 'Reinforce historical mastery with 3D flashcards, Match Madness, and 60-second speed blitz!'
              : 'Флеш-карталар, тарихи жұптарды табу (Match Madness) және 60 секундтық блиц-сайыс арқылы біліміңізді шыңдаңыз!'}
          </p>
        </div>

        {/* Quick Return to Map Button */}
        <button
          onClick={() => navigate('/learn')}
          className="px-4 py-2.5 rounded-2xl bg-surface-container-lowest text-primary font-headline text-xs font-black shadow-[0_3px_0_0_#dcdad2] flex items-center gap-2 hover:bg-white active:translate-y-0.5 active:shadow-none transition-all cursor-pointer self-start md:self-auto shrink-0"
        >
          <span className="material-symbols-outlined text-lg">map</span>
          <span>{lang === 'en' ? 'Learning Map' : 'Сабақ картасына өту'}</span>
        </button>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━ 2. GAMIFIED MODE SELECTOR (4 TABS) ━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('flashcards')}
          className={`p-3 sm:p-4 rounded-2xl font-headline text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'flashcards'
              ? 'bg-primary text-on-primary shadow-[0_4px_0_0_#337801] scale-[1.02]'
              : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-[0_2px_0_0_#dcdad2] border border-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-xl">style</span>
          <span>{lang === 'en' ? 'Flashcards' : '1. Флеш-карталар'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('match')}
          className={`p-3 sm:p-4 rounded-2xl font-headline text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'match'
              ? 'bg-secondary-container text-on-secondary-container shadow-[0_4px_0_0_#d89c00] scale-[1.02]'
              : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-[0_2px_0_0_#dcdad2] border border-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-xl text-amber-600">extension</span>
          <span>{lang === 'en' ? 'Match Madness' : '2. Жұптарды табу'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('blitz')}
          className={`p-3 sm:p-4 rounded-2xl font-headline text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'blitz'
              ? 'bg-tertiary-container text-on-tertiary-container shadow-[0_4px_0_0_#008b8b] scale-[1.02]'
              : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-[0_2px_0_0_#dcdad2] border border-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-xl text-sky-600">timer</span>
          <span>{lang === 'en' ? 'Speed Blitz' : '3. Блиц-спринт'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('refill')}
          className={`p-3 sm:p-4 rounded-2xl font-headline text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'refill'
              ? 'bg-red-500 text-white shadow-[0_4px_0_0_#b91c1c] scale-[1.02]'
              : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface shadow-[0_2px_0_0_#dcdad2] border border-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-xl text-error material-symbols-filled">favorite</span>
          <span>{lang === 'en' ? 'Heart Refill' : '4. Жүрекше алу'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: 3D FLASHCARDS WITH SRS & CATEGORIES                               */}
      {/* ========================================================================= */}
      {activeTab === 'flashcards' && (
        <div className="flex flex-col items-center animate-fadeIn w-full">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 mb-4 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: 'Барлық карточкалар' },
              { id: 'saka', label: 'Сақтар мен Алтын адам' },
              { id: 'botai', label: 'Ботай мәдениеті' },
              { id: 'khanate', label: 'Қазақ хандығы' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentCardIdx(0);
                  setIsFlipped(false);
                  setIsDeckCompleted(false);
                }}
                className={`px-3 py-1 rounded-full font-headline text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Deck Completed Screen */}
          {isDeckCompleted ? (
            <div className="w-full max-w-lg p-8 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-[0_8px_0_0_#dcdad2] flex flex-col items-center text-center animate-fadeIn my-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-secondary-container to-secondary-fixed flex items-center justify-center text-on-secondary-container shadow-lg mb-4 animate-bounce">
                <span className="material-symbols-outlined text-5xl material-symbols-filled">trophy</span>
              </div>
              <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface">
                {lang === 'en' ? 'Deck Completed!' : 'Карточкалар толық өтілді! 🎉'}
              </h2>
              <p className="font-body text-sm text-on-surface-variant mt-1 max-w-sm">
                {lang === 'en'
                  ? `You mastered ${masteredCount} out of ${filteredCards.length} historical cards and earned +25 XP!`
                  : `Сіз ${filteredCards.length} тарихи карточканың ${masteredCount}-ін толық меңгеріп, +25 XP жинадыңыз!`}
              </p>
              <button
                onClick={handleRestartDeck}
                className="mt-6 px-6 py-3 rounded-2xl bg-primary text-on-primary font-headline font-black text-sm shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none hover:bg-primary-container transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">replay</span>
                <span>{lang === 'en' ? 'Practice Again' : 'Қайта жаттығу'}</span>
              </button>
            </div>
          ) : (
            <div className="w-full max-w-lg flex flex-col items-center">
              {/* Progress HUD */}
              <div className="w-full flex items-center justify-between text-xs font-headline font-extrabold text-on-surface-variant mb-2 px-1">
                <span>{safeCardIdx + 1} / {filteredCards.length} {lang === 'en' ? 'Cards' : 'Карточка'}</span>
                <span className="text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm material-symbols-filled">verified</span>
                  {lang === 'en' ? `Mastered: ${masteredCount}` : `Меңгерілді: ${masteredCount}`}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden mb-5">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${((safeCardIdx + 1) / filteredCards.length) * 100}%` }}
                />
              </div>

              {/* 3D Flippable Card Container */}
              <div
                className="w-full min-h-[380px] perspective-1000 cursor-pointer select-none"
                onClick={() => {
                  setIsFlipped(!isFlipped);
                  sounds.playTileMatch?.();
                }}
              >
                <div
                  className={`w-full min-h-[380px] relative transform-style-3d transition-transform duration-500 rounded-3xl shadow-[0_8px_0_0_#dcdad2] border-2 border-surface-container ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* FRONT FACE */}
                  <div className="absolute inset-0 backface-hidden bg-surface-container-lowest rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-headline text-[11px] font-black uppercase tracking-wider">
                        {currentCard.tag}
                      </span>
                      <div className="flex items-center gap-1.5 text-on-surface-variant">
                        <span className="text-xs font-bold text-outline">#{safeCardIdx + 1}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            sounds.speakText(currentCard.frontEn || currentCard.front, 'en-US');
                          }}
                          className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-headline font-black flex items-center gap-1 cursor-pointer hover:bg-secondary-container transition-all shadow-xs"
                          title="Listen in English"
                        >
                          <span className="material-symbols-outlined text-[14px]">volume_up</span>
                          <span>🇬🇧 EN</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeak(currentCard.audioText || currentCard.front);
                          }}
                          className="w-7 h-7 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary cursor-pointer transition-colors"
                          title="Қазақша тыңдау"
                        >
                          <span className="material-symbols-outlined text-sm">volume_up</span>
                        </button>
                      </div>
                    </div>

                    {/* Middle: Artifact Image & Front Title */}
                    <div className="flex flex-col items-center text-center my-auto py-2">
                      {currentCard.image && (
                        <div className="w-36 h-28 sm:w-44 sm:h-32 rounded-2xl overflow-hidden mb-3 border border-surface-container shadow-xs bg-surface-container-low flex items-center justify-center">
                          <img
                            src={currentCard.image}
                            alt={currentCard.front}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      )}
                      <h3 className="font-headline text-xl sm:text-2xl font-black text-on-surface">
                        {currentCard.front}
                      </h3>
                      <div className="font-headline text-sm sm:text-base font-extrabold text-primary mt-0.5 flex items-center justify-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/10 font-black">🇬🇧 EN</span>
                        <span>{currentCard.frontEn}</span>
                      </div>
                      <p className="font-body text-xs sm:text-sm text-on-surface-variant font-medium mt-1">
                        {lang === 'en' ? currentCard.subEn : currentCard.sub}
                      </p>
                    </div>

                    {/* Bottom Hint */}
                    <div className="flex items-center justify-center gap-1.5 text-xs text-primary font-headline font-bold pt-2 border-t border-surface-container-low">
                      <span className="material-symbols-outlined text-base">touch_app</span>
                      <span>{lang === 'en' ? 'Tap to flip definition' : 'Анықтамасын көру үшін басыңыз'}</span>
                    </div>
                  </div>

                  {/* BACK FACE */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-2 border-primary/30">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-headline text-[11px] font-black uppercase tracking-wider">
                        {lang === 'en' ? 'Steppe Definition' : 'Тарихи анықтамасы'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(currentCard.audioText || currentCard.back);
                        }}
                        className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-primary cursor-pointer transition-colors"
                        title="Дыбыстап оқу"
                      >
                        <span className="material-symbols-outlined text-lg">volume_up</span>
                      </button>
                    </div>

                    <div className="my-auto py-2 text-center">
                      <p className="font-body text-sm sm:text-base text-on-surface font-semibold leading-relaxed">
                        {lang === 'en' ? currentCard.backEn : currentCard.back}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-outline font-headline font-bold pt-2 border-t border-surface-container-low">
                      <span className="material-symbols-outlined text-base">sync</span>
                      <span>{lang === 'en' ? 'Tap to flip back' : 'Қайта аудару үшін басыңыз'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spaced Repetition Bottom Decision Controls */}
              <div className="w-full flex items-center justify-between gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => handleNextCard(false)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-headline font-black text-xs sm:text-sm shadow-[0_3px_0_0_#dcdad2] flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-surface-container"
                >
                  <span className="material-symbols-outlined text-base">replay</span>
                  <span>{lang === 'en' ? 'Review Again' : 'Қайталау қажет'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNextCard(true)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-headline font-black text-xs sm:text-sm shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>{lang === 'en' ? 'I Know This! (+5 XP)' : 'Жаттадым! (+5 XP)'}</span>
                </button>
              </div>

              {/* Prev Button */}
              {safeCardIdx > 0 && (
                <button
                  type="button"
                  onClick={handlePrevCard}
                  className="mt-3 text-xs font-headline font-bold text-outline hover:text-on-surface flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>{lang === 'en' ? 'Previous Card' : 'Алдыңғы карта'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: MATCH MADNESS (Duolingo Style Steppe Pairs)                       */}
      {/* ========================================================================= */}
      {activeTab === 'match' && (
        <div className="flex flex-col items-center animate-fadeIn w-full max-w-2xl mx-auto">
          {matchCompleted ? (
            <div className="w-full p-8 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-[0_8px_0_0_#dcdad2] flex flex-col items-center text-center animate-fadeIn my-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white text-4xl shadow-lg mb-4 animate-bounce">
                🧩
              </div>
              <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface">
                {lang === 'en' ? 'Match Madness Completed!' : 'Барлық жұптар табылды! 🎉'}
              </h2>
              <p className="font-body text-sm text-on-surface-variant mt-1 max-w-sm">
                {lang === 'en'
                  ? 'Excellent speed! You matched all historical events and earned +30 XP!'
                  : 'Керемет жылдамдық! Барлық тарихи оқиғалар мен тұлғаларды сәйкестендіріп, +30 XP жинадыңыз!'}
              </p>
              <button
                onClick={startMatchGame}
                className="mt-6 px-6 py-3 rounded-2xl bg-secondary-container text-on-secondary-container font-headline font-black text-sm shadow-[0_4px_0_0_#d89c00] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">replay</span>
                <span>{lang === 'en' ? 'Play Again' : 'Қайта ойнау'}</span>
              </button>
            </div>
          ) : (
            <div className="w-full">
              {/* Top Match HUD */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div>
                  <h3 className="font-headline text-base font-black text-on-surface">
                    {lang === 'en' ? 'Match Steppe Pairs' : 'Тарихи Жұптарды Табыңыз'}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    {lang === 'en' ? 'Tap an item on left, then its match on right' : 'Сол жақтағы ұғымды оң жақтағы мағынасымен сәйкестендіріңіз'}
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-headline font-black text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm material-symbols-filled text-amber-500">local_fire_department</span>
                  <span>{matchStreak} Combo</span>
                </div>
              </div>

              {/* Match Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* LEFT COLUMN */}
                <div className="flex flex-col gap-2.5">
                  {matchLeftItems.map((item) => {
                    const isMatched = matchedIds.has(item.id);
                    const isSelected = selectedLeft?.id === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectLeft(item)}
                        disabled={isMatched}
                        className={`p-3.5 sm:p-4 rounded-2xl font-headline text-xs sm:text-sm font-black transition-all cursor-pointer text-left min-h-[64px] flex items-center justify-between ${
                          isMatched
                            ? 'opacity-0 pointer-events-none'
                            : isSelected
                            ? wrongPair
                              ? 'bg-error-container text-on-error-container border-2 border-error animate-shake'
                              : 'bg-primary text-on-primary shadow-[0_4px_0_0_#337801] scale-[1.03]'
                            : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-surface-container shadow-[0_2px_0_0_#dcdad2]'
                        }`}
                      >
                        <span>{item.text}</span>
                        {isSelected && <span className="material-symbols-outlined text-sm">check</span>}
                      </button>
                    );
                  })}
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex flex-col gap-2.5">
                  {matchRightItems.map((item) => {
                    const isMatched = matchedIds.has(item.id);
                    const isSelected = selectedRight?.id === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectRight(item)}
                        disabled={isMatched}
                        className={`p-3.5 sm:p-4 rounded-2xl font-body text-xs sm:text-sm font-bold transition-all cursor-pointer text-left min-h-[64px] flex items-center justify-between ${
                          isMatched
                            ? 'opacity-0 pointer-events-none'
                            : isSelected
                            ? wrongPair
                              ? 'bg-error-container text-on-error-container border-2 border-error animate-shake'
                              : 'bg-secondary-container text-on-secondary-container shadow-[0_4px_0_0_#d89c00] scale-[1.03]'
                            : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-surface-container shadow-[0_2px_0_0_#dcdad2]'
                        }`}
                      >
                        <span>{item.text}</span>
                        {isSelected && <span className="material-symbols-outlined text-sm">check</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: SPEED BLITZ (60-sec True/False Battle)                            */}
      {/* ========================================================================= */}
      {activeTab === 'blitz' && (
        <div className="flex flex-col items-center animate-fadeIn w-full max-w-xl mx-auto">
          {!blitzActive && !blitzFinished && (
            <div className="w-full p-8 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-[0_8px_0_0_#dcdad2] flex flex-col items-center text-center my-4">
              <div className="w-20 h-20 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center text-4xl mb-4">
                ⚡
              </div>
              <h2 className="font-headline text-2xl font-black text-on-surface">
                {lang === 'en' ? 'Steppe Speed Blitz' : 'Тарихшылар Блиц-сайысы'}
              </h2>
              <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-md">
                {lang === 'en'
                  ? '45 seconds on the clock! Rapid-fire True or False historical facts. How many can you answer correctly?'
                  : '45 секунд уақыт! «Шындық» па әлде «Жалған» ба? Барынша жылдам әрі қатесіз жауап беріп, рекорд орнатыңыз!'}
              </p>
              <button
                type="button"
                onClick={startBlitz}
                className="mt-6 px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-headline font-black text-sm shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">play_arrow</span>
                <span>{lang === 'en' ? 'Start Blitz (45s)' : 'Блицті бастау (45с)'}</span>
              </button>
            </div>
          )}

          {blitzActive && (
            <div className="w-full flex flex-col items-center">
              {/* Blitz Timer & Score Bar */}
              <div className="w-full flex items-center justify-between mb-3 px-1">
                <span className="font-headline font-black text-sm text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg">star</span>
                  <span>{blitzScore} {lang === 'en' ? 'Points' : 'Ұпай'}</span>
                </span>
                <span className="font-headline font-black text-sm text-error flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">timer</span>
                  <span>{blitzTimeLeft}с</span>
                </span>
              </div>

              {/* Timer Bar */}
              <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden mb-6">
                <div
                  className="h-full bg-error rounded-full transition-all duration-1000"
                  style={{ width: `${(blitzTimeLeft / 45) * 100}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="w-full p-6 sm:p-8 rounded-3xl bg-surface-container-lowest border-2 border-surface-container shadow-[0_8px_0_0_#dcdad2] flex flex-col justify-between min-h-[260px] text-center mb-6">
                <span className="text-[11px] font-headline font-black uppercase text-outline">
                  Сұрақ {blitzIdx + 1} / {BLITZ_QUESTIONS.length}
                </span>

                <h3 className="font-headline text-lg sm:text-xl font-black text-on-surface my-auto leading-relaxed">
                  «{BLITZ_QUESTIONS[blitzIdx]?.q}»
                </h3>

                {blitzFeedback && (
                  <div className={`p-3 rounded-2xl font-headline text-xs font-bold animate-fadeIn ${
                    blitzFeedback.correct ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
                  }`}>
                    {blitzFeedback.correct ? '✅ Дұрыс!' : '❌ Қате!'} {blitzFeedback.note}
                  </div>
                )}
              </div>

              {/* Decision Buttons */}
              <div className="w-full grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleBlitzAnswer(false)}
                  disabled={!!blitzFeedback}
                  className="py-4 rounded-2xl bg-error hover:bg-error/90 text-white font-headline font-black text-base shadow-[0_4px_0_0_#991b1b] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                  <span>{lang === 'en' ? 'False' : 'Жалған ❌'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBlitzAnswer(true)}
                  disabled={!!blitzFeedback}
                  className="py-4 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-headline font-black text-base shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">check</span>
                  <span>{lang === 'en' ? 'True' : 'Шындық ✅'}</span>
                </button>
              </div>
            </div>
          )}

          {blitzFinished && (
            <div className="w-full p-8 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-[0_8px_0_0_#dcdad2] flex flex-col items-center text-center animate-fadeIn my-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-400 to-sky-600 flex items-center justify-center text-white text-3xl shadow-lg mb-4">
                ⚡
              </div>
              <h2 className="font-headline text-2xl font-black text-on-surface">
                {lang === 'en' ? 'Blitz Finished!' : 'Блиц аяқталды! 🎉'}
              </h2>
              <p className="font-body text-sm text-on-surface-variant mt-1.5 max-w-sm">
                {lang === 'en'
                  ? `Your score: ${blitzScore} correct answers! +25 XP earned!`
                  : `Сіздің нәтижеңіз: ${blitzScore} дұрыс жауап! +25 XP қосылды!`}
              </p>
              <button
                type="button"
                onClick={startBlitz}
                className="mt-6 px-6 py-3 rounded-2xl bg-primary text-on-primary font-headline font-black text-sm shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">replay</span>
                <span>{lang === 'en' ? 'Play Again' : 'Қайта ойнау'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: HEART REFILL QUIZ                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'refill' && (
        <div className="flex flex-col items-center animate-fadeIn w-full max-w-lg mx-auto">
          {refillDone ? (
            <div className="w-full p-8 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-[0_8px_0_0_#dcdad2] flex flex-col items-center text-center my-4 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-4xl mb-4 animate-bounce">
                ❤️
              </div>
              <h2 className="font-headline text-2xl font-black text-on-surface">
                {lang === 'en' ? 'Hearts Fully Restored!' : 'Жүрекшелер толтырылды! ❤️'}
              </h2>
              <p className="font-body text-sm text-on-surface-variant mt-1.5 max-w-sm">
                {lang === 'en'
                  ? 'All 5 hearts restored! Keep learning on the Map!'
                  : 'Барлық 5 жүрекше қалпына келтірілді және +25 XP берілді! Сабақ картасында саяхатыңызды жалғастырыңыз!'}
              </p>
              <button
                type="button"
                onClick={() => navigate('/learn')}
                className="mt-6 px-6 py-3 rounded-2xl bg-primary text-on-primary font-headline font-black text-sm shadow-[0_4px_0_0_#337801] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">map</span>
                <span>{lang === 'en' ? 'Return to Map' : 'Картаға оралу'}</span>
              </button>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="font-headline text-xs font-black text-on-surface-variant">
                  {refillQuestionIdx + 1} / {REFILL_QUESTIONS.length} {lang === 'en' ? 'Question' : 'Сұрақ'}
                </span>
                <span className="text-error font-headline font-black text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm material-symbols-filled">favorite</span>
                  <span>+5 Жүрекше</span>
                </span>
              </div>

              <div className="w-full p-6 sm:p-7 rounded-3xl bg-surface-container-lowest border-2 border-surface-container shadow-[0_8px_0_0_#dcdad2] mb-5 text-center">
                <h3 className="font-headline text-base sm:text-lg font-black text-on-surface">
                  {REFILL_QUESTIONS[refillQuestionIdx].q}
                </h3>
              </div>

              <div className="flex flex-col gap-2.5">
                {REFILL_QUESTIONS[refillQuestionIdx].options.map((opt, idx) => {
                  const isSelected = refillSelected === idx;
                  const isCorrect = idx === REFILL_QUESTIONS[refillQuestionIdx].correct;

                  let style = 'bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-surface-container shadow-[0_2px_0_0_#dcdad2]';
                  if (isSelected) {
                    style = isCorrect
                      ? 'bg-primary text-on-primary border-primary shadow-[0_4px_0_0_#337801]'
                      : 'bg-error text-white border-error shadow-[0_4px_0_0_#991b1b]';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleRefillAnswer(idx)}
                      disabled={refillSelected !== null}
                      className={`p-4 rounded-2xl font-headline text-sm font-black text-left transition-all cursor-pointer flex items-center justify-between ${style}`}
                    >
                      <span>{opt}</span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-base">
                          {isCorrect ? 'check_circle' : 'cancel'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
