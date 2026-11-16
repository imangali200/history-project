import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MockDbService, MockUser } from '../../database/mock-db.service';
import { ChatMessageDto } from './dto/chat.dto';

@Injectable()
export class AiTutorService {
  private readonly logger = new Logger(AiTutorService.name);

  constructor(
    private configService: ConfigService,
    private mockDb: MockDbService,
  ) {}

  async askAiTarihshy(dto: ChatMessageDto, user: MockUser) {
    const question = dto.message.toLowerCase().trim();

    // Reward 5 XP for asking AI Tarihshy
    const dbUser = this.mockDb.users.find((u) => u.id === user.id);
    if (dbUser) {
      dbUser.xp += 5;
    }

    // Historical Knowledge Base Engine
    let responseText = '';

    if (question.includes('хандық') || question.includes('керей') || question.includes('жәнібек')) {
      responseText =
        'Қазақ хандығының негізін 1465 жылы Керей мен Жәнібек сұлтандар Қозыбасы жерінде (Жетісу өңірі) қалады. Олар Әбілқайыр хандығынан бөлініп, Моғолстан ханы Есенбұғаның жеріне қоныс аударды. Бұл қазақ мемлекеттілігінің алтын бастауы!';
    } else if (question.includes('сақ') || question.includes('томирис') || question.includes('алтын адам')) {
      responseText =
        'Сақтар — б.з.б. I мыңжылдықта Ұлы Даланы мекендеген жауынгер тайпалар. 1969 жылы Кемал Ақышев тапқан "Алтын Адам" (Есік қорғаны) сақтардың зергерлік шеберлігінің шыңы. Ал б.з.б. 530 жылы Томирис патшайым парсы патшасы Кирді талқандап, ел тәуелсіздігін қорғады.';
    } else if (question.includes('түрік') || question.includes('бумын') || question.includes('күлтегін')) {
      responseText =
        'Ұлы Түрік қағанаты 552 жылы Бумын қаған негізін қалаған алып империя. "Түркі" атауы алғаш рет қытай жылнамаларында 542 жылы кездеседі. Орхон-Енисей ескерткіштеріндегі Күлтегін мен Тоныкөк тас жазулары бізге жеткен мәңгілік жәдігерлер!';
    } else if (question.includes('абылай') || question.includes('жоңғар') || question.includes('шайқас')) {
      responseText =
        'Абылай хан (Әбілмансұр) — XVIII ғасырдағы Қазақ хандығының ұлы билеушісі, қолбасшы әрі шебер дипломат. Ол Ресей мен Цин империялары арасында теңгерімді саясат жүргізіп, қазақ жерінің тұтастығын сақтап қалды.';
    } else {
      responseText = `Сәлеметсіз бе, құрметті зерттеуші ${user.name}! Ұлы Дала тарихы — терең сырларға толы қазына. Сіздің сұрағыңыз: "${dto.message}". Қазақ даласы Ботай мәдениетінен, Сақ пен Ғұн дәуірінен, Алтын Орда мен Қазақ хандығынан бастап Тәуелсіздікке дейінгі мыңдаған жылдық ұлы шежірені қамтиды. Кез келген тақырып бойынша тереңірек сұрасаңыз, қуана жауап беремін!`;
    }

    return {
      success: true,
      sender: 'AI Tarihshy (SDU Academic Assistant)',
      reply: responseText,
      xpEarned: 5,
      suggestedQuestions: [
        'Сақтар мен Томирис патшайым туралы айтып берші',
        'Қазақ хандығы қалай құрылды?',
        'Ұлы Жібек жолының қалалары қандай?',
      ],
      timestamp: new Date().toISOString(),
    };
  }
}
