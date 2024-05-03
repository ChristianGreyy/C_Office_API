import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class LocalesService {
  constructor(private readonly i18n: I18nService) {}

  translate(key: string, language = I18nContext.current()?.lang || 'en'): string {
    return this.i18n.t(key, {
      lang: language,
    });
  }
}
