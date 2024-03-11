import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from 'src/interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IResponse> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
    // ): Observable<IResponse> {
  ): Observable<any> {
    const response = context.switchToHttp().getResponse<IResponse>();
    console.log(response.message)
    return next.handle().pipe(
      map((data) => ({
        data,
        code: response.statusCode ?? 200,
        message: response.message ?? '',
      })),
    );
  }
}
