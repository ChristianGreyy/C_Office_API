import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { swaggerConfig } from './docs/swagger';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpAdapterHost = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new HttpExceptionsFilter(httpAdapterHost));
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalFilters(new I18nValidationExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  // app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  swaggerConfig(app);

  await app.listen(8080);
}
bootstrap();
