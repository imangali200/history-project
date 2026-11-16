import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export interface MockUser {
  id: string;
  studentId?: string;
  email: string;
  passwordHash: string;
  name: string;
  nameEn?: string;
  avatar: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  faculty?: string;
  facultyEn?: string;
  specialty?: string;
  course?: number;
  xp: number;
  level: number;
  coins: number;
  hearts: number;
  streak: number;
  lastActiveDate?: string;
  timeCrystalFragments: number[];
  unlockedArtifacts: string[];
}

@Injectable()
export class MockDbService {
  public users: MockUser[] = [];
  public eras: any[] = [];
  public lessons: any[] = [];
  public gameDestinations: any[] = [];
  public artifacts: any[] = [];
  public dailyQuests: any[] = [];

  constructor() {
    this.seedInitialData();
  }

  private async seedInitialData() {
    const passHash = await bcrypt.hash('password123', 10);

    // Initial SDU Students
    this.users = [
      {
        id: 'user-sdu-batyr-220107045',
        studentId: '220107045',
        email: '220107045@stu.sdu.edu.kz',
        passwordHash: passHash,
        name: 'Батыр Сұлтанов',
        nameEn: 'Batyr Sultanov',
        avatar: 'batyr',
        role: 'STUDENT',
        faculty: 'Инженерия және жаратылыстану ғылымдары факультеті (FEAS)',
        facultyEn: 'Faculty of Engineering & Natural Sciences (FEAS)',
        specialty: 'Ақпараттық жүйелер (Information Systems)',
        course: 3,
        xp: 450,
        level: 5,
        coins: 350,
        hearts: 5,
        streak: 4,
        timeCrystalFragments: [1, 2, 3, 5],
        unlockedArtifacts: ['golden-headdress', 'astrolabe'],
      },
      {
        id: 'user-sdu-aruzhan-240103012',
        studentId: '240103012',
        email: '240103012@stu.sdu.edu.kz',
        passwordHash: passHash,
        name: 'Аружан Қайратқызы',
        nameEn: 'Aruzhan Kairatkyzy',
        avatar: 'tomiris',
        role: 'STUDENT',
        faculty: 'Білім және гуманитарлық ғылымдар факультеті (FEH)',
        facultyEn: 'Faculty of Education & Humanities (FEH)',
        specialty: 'Қазақ тілі мен тарихы (Kazakh History & Lang)',
        course: 1,
        xp: 120,
        level: 2,
        coins: 150,
        hearts: 5,
        streak: 2,
        timeCrystalFragments: [1],
        unlockedArtifacts: ['golden-headdress'],
      },
    ];

    // Eras & Units
    this.eras = [
      {
        id: 'era-1',
        slug: 'stone-age',
        titleKz: 'Тас және Сақ дәуірі',
        titleEn: 'Stone Age & Saka Era',
        units: [
          {
            id: 'unit-1',
            slug: 'paleolithic',
            titleKz: '1-бөлім: Ежелгі адамдар мен Ботай мәдениеті',
            lessons: ['stone-age-1', 'stone-age-2'],
          },
        ],
      },
      {
        id: 'era-2',
        slug: 'turkic-khaganate',
        titleKz: 'Түрік қағанаттары мен Алтын Орда',
        titleEn: 'Turkic Khaganates & Golden Horde',
        units: [
          {
            id: 'unit-2',
            slug: 'turkic-birth',
            titleKz: '2-бөлім: 552 жылғы Түрік қағанаты',
            lessons: ['turkic-1'],
          },
        ],
      },
    ];

    // Lessons with interactive questions
    this.lessons = [
      {
        id: 'stone-age-1',
        titleKz: 'Палеолит дәуірінің алғашқы адамдары',
        titleEn: 'Early Humans of Paleolithic',
        description: 'Ботай мәдениеті, тас құралдар және адамдардың алғашқы тұрақтары',
        xpReward: 25,
        questions: [
          {
            id: 'q1',
            type: 'MULTIPLE_CHOICE',
            promptKz: 'Қазақстан аумағындағы жылқыны алғаш қолға үйреткен ежелгі мәдениет қалай аталады?',
            options: ['Ботай мәдениеті', 'Андрон мәдениеті', 'Беғазы-Дәндібай мәдениеті', 'Сармат мәдениеті'],
            correctAnswer: 'Ботай мәдениеті',
            explanationKz: 'Ботай мәдениеті (б.з.б. IV–III мыңжылдықтар) жылқыны ең алғаш қолға үйреткен мәдениет.',
          },
          {
            id: 'q2',
            type: 'TRUE_FALSE',
            promptKz: 'Есік қорғанынан табылған "Алтын Адам" б.з.б. V-IV ғасырларға жатады.',
            options: ['Шындық', 'Жалған'],
            correctAnswer: 'Шындық',
            explanationKz: 'Есік қорғаны б.з.б. V–IV ғасырлардағы Сақ мәдениетінің баға жетпес ескерткіші.',
          },
        ],
      },
      {
        id: 'stone-age-2',
        titleKz: 'Сақтардың билеушісі Томирис',
        titleEn: 'Queen Tomyris of the Sakas',
        description: 'Кир патшасына қарсы Сақтардың азаттық соғысы',
        xpReward: 30,
        questions: [
          {
            id: 'q3',
            type: 'MULTIPLE_CHOICE',
            promptKz: 'Сақ патшайымы Томирис парсы патшасы Кирді қай жылы талқандады?',
            options: ['б.з.б. 530 ж.', 'б.з.б. 519 ж.', 'б.з.б. 329 ж.', 'б.з.б. 450 ж.'],
            correctAnswer: 'б.з.б. 530 ж.',
            explanationKz: 'Б.з.б. 530 жылы Томирис патшайым Кирдің басқыншы әскерін жеңді.',
          },
        ],
      },
    ];

    // 10 History World Destinations
    this.gameDestinations = [
      { key: 'time-travel', titleKz: 'Уақыт Порталы', titleEn: 'Time Travel Portal', icon: 'timelapse', fragmentReward: 1 },
      { key: 'detective', titleKz: 'Тарих Детективы', titleEn: 'History Detective', icon: 'search', fragmentReward: 2 },
      { key: 'battle', titleKz: 'Білім Шайқасы', titleEn: 'Battle Arena', icon: 'swords', fragmentReward: 3 },
      { key: 'guess-hero', titleKz: 'Тұлғаны Тан', titleEn: 'Hall of Heroes', icon: 'person_search', fragmentReward: 4 },
      { key: 'map-explorer', titleKz: 'Карта Зерттеушісі', titleEn: 'Ancient Map Explorer', icon: 'explore', fragmentReward: 5 },
      { key: 'timeline', titleKz: 'Хронология Ғибадатханасы', titleEn: 'Timeline Temple', icon: 'view_timeline', fragmentReward: 6 },
      { key: 'become-hero', titleKz: 'Батыр Жолы', titleEn: "Hero's Journey", icon: 'shield_person', fragmentReward: 7 },
      { key: 'archaeologist', titleKz: 'Археологиялық Қазба', titleEn: 'Archaeologist', icon: 'archaeology', fragmentReward: 8 },
      { key: 'kingdom-builder', titleKz: 'Орда Құру', titleEn: 'Kingdom Builder', icon: 'fort', fragmentReward: 9 },
      { key: 'escape-room', titleKz: 'Көне Қамал Құпиясы', titleEn: 'Ancient Escape Dungeon', icon: 'vpn_key', fragmentReward: 10 },
    ];

    // 10 Artifacts
    this.artifacts = [
      { key: 'golden-headdress', nameKz: 'Алтын Тәж & Қауырсын', nameEn: 'Golden Saka Crown', era: 'Сақ дәуірі (б.з.б. V ғ.)', rarity: 'LEGENDARY' },
      { key: 'astrolabe', nameKz: 'Әл-Фараби Астролябиясы', nameEn: 'Ancient Astrolabe', era: 'Орта ғасыр (X ғ.)', rarity: 'EPIC' },
      { key: 'kultegin-seal', nameKz: 'Күлтегін Қаған Тас Мөрі', nameEn: 'Kultegin Runestone Seal', era: 'Түрік қағанаты (VIII ғ.)', rarity: 'EPIC' },
      { key: 'khan-kordyk', nameKz: 'Қасым Ханның Алтын Сақинасы', nameEn: "Kasym Khan's Royal Signet", era: 'Қазақ хандығы (XVI ғ.)', rarity: 'LEGENDARY' },
      { key: 'otrar-jug', nameKz: 'Отырар Керамика Құмырасы', nameEn: 'Otrar Ceramic Jar', era: 'Қарахан дәуірі (XI ғ.)', rarity: 'RARE' },
    ];

    // Daily Quests
    this.dailyQuests = [
      { id: 'quest-1', titleKz: 'Күнделікті 1 сабақты 100% аяқтау', targetCount: 1, actionType: 'LESSON_COMPLETE', xpReward: 35, coinReward: 50 },
      { id: 'quest-2', titleKz: 'Тарих әлемінде 50 XP ұтып алу', targetCount: 50, actionType: 'EARN_XP', xpReward: 40, coinReward: 60 },
      { id: 'quest-3', titleKz: 'Кез келген 1 тарихи ойынды жеңіспен аяқтау', targetCount: 1, actionType: 'GAME_WIN', xpReward: 50, coinReward: 100 },
    ];
  }
}
