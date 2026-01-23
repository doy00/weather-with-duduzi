import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // Vite 개발 서버
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
  console.log('📚 API Docs available at http://localhost:' + port + '/api/docs');
}
bootstrap();
