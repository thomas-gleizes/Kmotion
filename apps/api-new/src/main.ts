import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { environment } from './core/config/environment';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import HttpLoggingInterceptor from 'src/shared/presentation/interceptor/http-loging.interceptor';
import { DomainExceptionFilter } from 'src/shared/presentation/exception-filters/domain.exception-filter';
import { GlobalExceptionFilters } from 'src/shared/presentation/exception-filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Kmotion',
    }),
  });

  app.setGlobalPrefix('api/3.1');
  app.useGlobalInterceptors(new HttpLoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new DomainExceptionFilter());
  app.useGlobalFilters(new GlobalExceptionFilters());

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
