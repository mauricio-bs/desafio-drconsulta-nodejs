import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  // Documentation
  const config = new DocumentBuilder()
    .setTitle('Parking manager api')
    .setDescription(
      'Documentation for parking manager api for dr. consulta technical testing',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
