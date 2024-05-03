import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { swaggerConfig } from './docs/swagger';
import { AppModule } from './modules/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(morgan('dev'));
  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  swaggerConfig(app);

  await app.listen(8080);
}
bootstrap();
