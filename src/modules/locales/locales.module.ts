import { Module } from '@nestjs/common';
import * as path from 'path';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { LocalesService } from './locales.service';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../../../i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'en']),
        new HeaderResolver(['x-lang']),
        new CookieResolver(),
        AcceptLanguageResolver,
      ],
    }),
  ],
  providers: [LocalesService],
  exports: [LocalesService],
})
export class LocalesModule {}
