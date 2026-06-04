import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { environment } from './core/config/environment';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import HttpLoggingInterceptor from 'src/shared/presentation/interceptor/http-loging.interceptor';
import { DomainExceptionFilter } from 'src/shared/presentation/exception-filters/domain.exception-filter';
import { GlobalExceptionFilters } from 'src/shared/presentation/exception-filters/global-exception.filter';
import {
  API_PREFIX,
  API_OPENAPI,
  API_VERSION,
} from 'src/core/config/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Kmotion',
    }),
  });

  const logger = new Logger('MAIN');

  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalInterceptors(new HttpLoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new DomainExceptionFilter());
  app.useGlobalFilters(new GlobalExceptionFilters());

  const document = new DocumentBuilder()
    .setTitle('Kmotion api')
    .setDescription('Kmotion api description')
    .setVersion(API_VERSION)
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, document);
  SwaggerModule.setup(API_OPENAPI, app, documentFactory, {
    jsonDocumentUrl: API_OPENAPI + '.json',
    yamlDocumentUrl: API_OPENAPI + '.yaml',
  });

  await app.listen(environment.PORT, '0.0.0.0');
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
