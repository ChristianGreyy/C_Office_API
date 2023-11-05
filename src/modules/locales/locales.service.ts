import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class LocalesService {
  constructor(private readonly i18n: I18nService) {}

  translate(key: string, language = 'en'): string {
    return this.i18n.t(key, {
      lang: language,
    });
  }
}
