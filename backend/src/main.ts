import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('QAZHISTORY-Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Enable Global Prefix
  app.setGlobalPrefix('api');

  // 2. Configure CORS
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // 3. Global Exception Filter & Transform Envelope Interceptor
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // 4. Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // 5. OpenAPI Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('QAZHISTORY & History World API')
    .setDescription(
      'Senior-Grade NestJS REST API for SDU University Gamified History Learning Platform. Includes SDU Auth, Duolingo Curriculum, 10 History World Modes, Leaderboards, and AI Tarihshy.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'SDU Portal Login, Register, Session')
    .addTag('Curriculum & Lessons', 'Duolingo-style Eras, Units, Questions')
    .addTag('History World Games (10 Modes)', 'Time Crystal, Artifacts & 10 Game Engines')
    .addTag('Leaderboard & Leagues', 'Weekly rankings, SDU Faculty filtering')
    .addTag('AI Tarihshy (AI Historical Tutor)', 'Conversational historical knowledge')
    .addTag('Users & Profile', 'Student stats, avatar, level progression')
    .addTag('Daily Quests & Streaks', 'Habit building quests & rewards')
    .addTag('SDU Certificates & Verification', 'PDF verifiable course certificates')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'QAZHISTORY API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 QAZHISTORY Backend successfully running on: http://localhost:${port}/api`);
  logger.log(`📚 Swagger OpenAPI Documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();
