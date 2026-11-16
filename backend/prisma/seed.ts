import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting QAZHISTORY Database Seeding...');

  // 1. Clear existing data in reverse relation order (if any)
  try {
    await prisma.userLessonProgress.deleteMany();
    await prisma.question.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.unit.deleteMany();
    await prisma.era.deleteMany();
    await prisma.gameSession.deleteMany();
    await prisma.gameDestination.deleteMany();
    await prisma.userArtifact.deleteMany();
    await prisma.artifact.deleteMany();
    await prisma.userDailyQuest.deleteMany();
    await prisma.dailyQuest.deleteMany();
    await prisma.userAchievement.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    console.log('Skipping deleteMany on empty db');
  }

  const defaultPassword = await bcrypt.hash('password123', 10);

  // 2. Seed SDU Students & Test Accounts
  const batyr = await prisma.user.create({
    data: {
      studentId: '220107045',
      email: '220107045@stu.sdu.edu.kz',
      passwordHash: defaultPassword,
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
    },
  });

  const aruzhan = await prisma.user.create({
    data: {
      studentId: '240103012',
      email: '240103012@stu.sdu.edu.kz',
      passwordHash: defaultPassword,
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
    },
  });

  console.log('✅ Users seeded successfully:', batyr.name, aruzhan.name);

  // 3. Seed Eras, Units & Lessons
  const era1 = await prisma.era.create({
    data: {
      slug: 'stone-age',
      titleKz: 'Тас және Сақ дәуірі',
      titleEn: 'Stone Age & Saka Era',
      description: 'Ежелгі адамдардың пайда болуынан Алтын Адам мәдениетіне дейін',
      order: 1,
      units: {
        create: [
          {
            slug: 'paleolithic-settlements',
            titleKz: '1-бөлім: Ежелгі тұрақтар мен құралдар',
            titleEn: 'Unit 1: Ancient Settlements & Tools',
            order: 1,
            lessons: {
              create: [
                {
                  slug: 'stone-age-1',
                  titleKz: 'Палеолит дәуірінің алғашқы адамдары',
                  titleEn: 'Early Humans of Paleolithic',
                  description: 'Ботай мәдениеті, тас құралдар және адамдардың алғашқы тұрақтары',
                  xpReward: 25,
                  order: 1,
                  questions: {
                    create: [
                      {
                        type: 'MULTIPLE_CHOICE',
                        promptKz: 'Қазақстан аумағындағы жылқыны алғаш қолға үйреткен ежелгі мәдениет қалай аталады?',
                        promptEn: 'What is the name of the ancient culture that first domesticated the horse in Kazakhstan?',
                        options: ['Ботай мәдениеті', 'Андрон мәдениеті', 'Беғазы-Дәндібай мәдениеті', 'Сармат мәдениеті'],
                        correctAnswer: 'Ботай мәдениеті',
                        explanationKz: 'Ботай мәдениеті (б.з.б. IV–III мыңжылдықтар) жылқыны ең алғаш қолға үйреткендігімен әлемге танымал.',
                      },
                      {
                        type: 'TRUE_FALSE',
                        promptKz: 'Есік қорғанынан табылған "Алтын Адам" б.з.б. V-IV ғасырларға жатады.',
                        promptEn: 'The "Golden Warrior" discovered in Issyk kurgan dates to 5th-4th century BC.',
                        options: ['Шындық', 'Жалған'],
                        correctAnswer: 'Шындық',
                        explanationKz: '1969 жылы Кемал Ақышев тапқан Есік қорғаны б.з.б. V–IV ғасырлардағы Сақ мәдениетінің ескерткіші.',
                      },
                    ],
                  },
                },
                {
                  slug: 'stone-age-2',
                  titleKz: 'Сақтардың билеушісі Томирис',
                  titleEn: 'Queen Tomyris of the Sakas',
                  description: 'Кир патшасына қарсы Сақтардың азаттық соғысы',
                  xpReward: 30,
                  order: 2,
                  questions: {
                    create: [
                      {
                        type: 'MULTIPLE_CHOICE',
                        promptKz: 'Сақ патшайымы Томирис парсы патшасы Кирді қай жылы талқандады?',
                        promptEn: 'In what year did Queen Tomyris defeat Persian King Cyrus?',
                        options: ['б.з.б. 530 ж.', 'б.з.б. 519 ж.', 'б.з.б. 329 ж.', 'б.з.б. 450 ж.'],
                        correctAnswer: 'б.з.б. 530 ж.',
                        explanationKz: 'Б.з.б. 530 жылы Томирис патшайым бастаған сақтар Кирдің әскерін толық талқандады.',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  const era2 = await prisma.era.create({
    data: {
      slug: 'turkic-khaganate',
      titleKz: 'Түрік қағанаттары мен Алтын Орда',
      titleEn: 'Turkic Khaganates & Golden Horde',
      description: 'Ұлы Дала империялары, Жошы Ұлысы және қалалық өркениет',
      order: 2,
      units: {
        create: [
          {
            slug: 'turkic-empire-birth',
            titleKz: '2-бөлім: 552 жылғы Ұлы Түрік қағанаты',
            titleEn: 'Unit 2: The Great Turkic Khaganate 552 AD',
            order: 2,
            lessons: {
              create: [
                {
                  slug: 'turkic-1',
                  titleKz: 'Бумын және Мұқан қағандар',
                  titleEn: 'Bumin & Mukan Khagans',
                  xpReward: 30,
                  order: 1,
                  questions: {
                    create: [
                      {
                        type: 'MULTIPLE_CHOICE',
                        promptKz: '552 жылы Түрік қағанатының негізін қалаған билеуші кім?',
                        options: ['Бумын қаған', 'Күлтегін', 'Тоныкөк', 'Елтеріс'],
                        correctAnswer: 'Бумын қаған',
                        explanationKz: '552 жылы Бумын жужандарды жеңіп, "Елхан" атағын алып Түрік қағанатын құрды.',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 4. Seed the 10 History World Game Destinations
  const destinations = [
    { key: 'time-travel', titleKz: 'Уақыт Порталы', titleEn: 'Time Travel Portal', desc: 'Дәуірлер арасында саяхаттау', icon: 'timelapse', req: 0, rew: 1 },
    { key: 'detective', titleKz: 'Тарих Детективы', titleEn: 'History Detective', desc: 'Көне құжаттар мен мөрлер сыры', icon: 'search', req: 0, rew: 2 },
    { key: 'battle', titleKz: 'Білім Шайқасы', titleEn: 'Battle Arena', desc: 'Тарихи жауаптармен жауды жеңу', icon: 'swords', req: 0, rew: 3 },
    { key: 'guess-hero', titleKz: 'Тұлғаны Тан', titleEn: 'Hall of Heroes', desc: 'Сұлба арқылы батырларды табу', icon: 'person_search', req: 0, rew: 4 },
    { key: 'map-explorer', titleKz: 'Карта Зерттеушісі', titleEn: 'Ancient Map Explorer', desc: 'Жібек Жолы мен көне қалалар', icon: 'explore', req: 0, rew: 5 },
    { key: 'timeline', titleKz: 'Хронология Ғибадатханасы', titleEn: 'Timeline Temple', desc: 'Оқиғаларды рет-ретімен орналастыру', icon: 'view_timeline', req: 0, rew: 6 },
    { key: 'become-hero', titleKz: 'Батыр Жолы', titleEn: "Hero's Journey", desc: 'Тарихи таңдаулар симуляторы', icon: 'shield_person', req: 0, rew: 7 },
    { key: 'archaeologist', titleKz: 'Археологиялық Қазба', titleEn: 'Archaeologist', desc: 'Топырақ астындағы құнды жәдігерлер', icon: 'archaeology', req: 0, rew: 8 },
    { key: 'kingdom-builder', titleKz: 'Орда Құру', titleEn: 'Kingdom Builder', desc: 'Киіз үйлер, шеберханалар мен көш', icon: 'fort', req: 0, rew: 9 },
    { key: 'escape-room', titleKz: 'Көне Қамал Құпиясы', titleEn: 'Ancient Escape Dungeon', desc: 'Отырар цитаделінің жұмбағын шешу', icon: 'vpn_key', req: 0, rew: 10 },
  ];

  for (const d of destinations) {
    await prisma.gameDestination.create({
      data: {
        key: d.key,
        titleKz: d.titleKz,
        titleEn: d.titleEn,
        descriptionKz: d.desc,
        icon: d.icon,
        requiredFragment: d.req,
        rewardFragmentId: d.rew,
      },
    });
  }

  // 5. Seed 10 Ancient Artifacts
  const artifacts = [
    { key: 'golden-headdress', nameKz: 'Алтын Тәж & Қауырсын', nameEn: 'Golden Saka Crown', era: 'Сақ дәуірі (б.з.б. V ғ.)', desc: 'Есік қорғанынан табылған 4000-нан астам алтын әшекейі бар тәж.', rarity: 'LEGENDARY' },
    { key: 'astrolabe', nameKz: 'Әл-Фараби Астролябиясы', nameEn: 'Ancient Astrolabe', era: 'Орта ғасыр (X ғ.)', desc: 'Жұлдыздар мен қалалар бағытын дәл анықтайтын көне құрал.', rarity: 'EPIC' },
    { key: 'kultegin-seal', nameKz: 'Күлтегін Қаған Тас Мөрі', nameEn: 'Kultegin Runestone Seal', era: 'Түрік қағанаты (VIII ғ.)', desc: 'Орхон-Енисей көне түрік сына жазуы қашалған мәңгілік мөр.', rarity: 'EPIC' },
    { key: 'khan-kordyk', nameKz: 'Қасым Ханның Алтын Сақинасы', nameEn: "Kasym Khan's Royal Signet", era: 'Қазақ хандығы (XVI ғ.)', desc: '«Қасым ханның қасқа жолы» заңдар жинағы бекітілген мемлекеттік мөр.', rarity: 'LEGENDARY' },
    { key: 'otrar-jug', nameKz: 'Отырар Керамика Құмырасы', nameEn: 'Otrar Ceramic Jar', era: 'Қарахан дәуірі (XI ғ.)', desc: 'Ұлы Жібек жолы бойында шебер өрнектелген шыныланған ыдыс.', rarity: 'RARE' },
  ];

  for (const a of artifacts) {
    await prisma.artifact.create({
      data: {
        key: a.key,
        nameKz: a.nameKz,
        nameEn: a.nameEn,
        era: a.era,
        descriptionKz: a.desc,
        rarity: a.rarity as any,
      },
    });
  }

  // 6. Seed Daily Quests
  await prisma.dailyQuest.createMany({
    data: [
      { titleKz: 'Күнделікті 1 сабақты 100% аяқтау', titleEn: 'Complete 1 lesson today with 100%', targetCount: 1, actionType: 'LESSON_COMPLETE', xpReward: 35, coinReward: 50 },
      { titleKz: 'Тарих әлемінде 50 XP ұтып алу', titleEn: 'Earn 50 XP in History World', targetCount: 50, actionType: 'EARN_XP', xpReward: 40, coinReward: 60 },
      { titleKz: 'Кез келген 1 тарихи ойынды жеңіспен аяқтау', titleEn: 'Win any 1 Historical Game', targetCount: 1, actionType: 'GAME_WIN', xpReward: 50, coinReward: 100 },
    ],
  });

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
