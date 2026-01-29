import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOriginsFromEnv = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [];

  const whitelist = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173',
    ...allowedOriginsFromEnv,
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if origin is in the dynamic whitelist OR is a vercel.app preview domain
      if (whitelist.includes(origin) || /\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Weather with Duduzi API')
    .setDescription('날씨 앱 + Daily Inspiration Message API 문서')
    .setVersion('1.0')
    .addTag('Weather', '날씨 조회 API')
    .addTag('Location', '위치 검색 API')
    .addTag('Favorites', '즐겨찾기 관리 API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Weather API Docs',
    customfavIcon: '🌤️',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log('🚀 Backend server running on http://localhost:' + port);
  console.log(
    '📚 API Docs available at http://localhost:' + port + '/api/docs',
  );
}
void bootstrap();
