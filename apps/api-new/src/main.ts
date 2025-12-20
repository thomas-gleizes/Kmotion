import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { environment } from './core/config/environment';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpLoggingInterceptor } from 'src/shared/presentation/interceptor/http-loging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/3.1');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new HttpLoggingInterceptor());

  const document = new DocumentBuilder()
    .setTitle('Kmotion api')
    .setDescription('Kmotion api description')
    .setVersion('3.1')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('api/3.1/swagger', app, documentFactory);

  await app.listen(environment.PORT);
}

bootstrap();
