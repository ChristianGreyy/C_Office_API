import { Module } from '@nestjs/common';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
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
        { use: QueryResolver, options: ['x-lang'] },
        AcceptLanguageResolver,
      ],
    }),
  ],
  providers: [LocalesService],
  exports: [LocalesService],
})
export class LocalesModule {}
