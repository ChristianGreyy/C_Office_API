import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  I18nContext,
  I18nService,
  I18nValidationException,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils';
import { ERROR_MESSAGE } from 'src/constants';

@Catch()
export class HttpExceptionFilter extends I18nValidationExceptionFilter {
  catch(exception: I18nValidationException, host: ArgumentsHost): any {
    console.log('exception', exception);
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse<Response>();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : ERROR_MESSAGE.INTERNAL_SERVER_ERROR;

    const i18n = I18nContext.current();

    formatI18nErrors(exception.errors ?? [], i18n?.service, {
      lang: i18n?.lang,
    });

    const exceptionResponse =
      exception instanceof I18nValidationException ? exception.errors : [];

    const i18Error = [];
    exception.errors?.forEach((error: any) => {
      if (error.children.length > 0) {
        error.children.forEach((child: any) => {
          child.children.forEach((item) => {
            i18Error.push(Object.values(item.constraints)[0]);
          });
        });
      }
      if (Object.keys(error.constraints).length > 0) {
        i18Error.push(Object.values(error.constraints)[0]);
      }
    });

    const responseBody = {
      statusCode: httpStatus,
      message,
      errors: i18Error.length > 0 ? i18Error : exceptionResponse,
    };
    response.json(responseBody);
  }
}
