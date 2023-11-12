import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorHelper {
  static BadRequestException(msg: string | string[]) {
    throw new HttpException(msg, HttpStatus.BAD_REQUEST);
  }
  static UnauthorizedException(msg: string) {
    throw new HttpException(msg, HttpStatus.UNAUTHORIZED);
  }
  static NotFoundException(msg: string) {
    throw new HttpException(msg, HttpStatus.NOT_FOUND);
  }
  static ForbiddenException(msg: string) {
    throw new HttpException(msg, HttpStatus.FORBIDDEN);
  }
  static InternalServerErrorException(msg: string) {
    throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
  }
  static UnprocessableEntityException(msg: string) {
    throw new HttpException(msg, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
