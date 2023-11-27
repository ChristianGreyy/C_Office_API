import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { COMMON_MESSAGE } from 'src/messages';

export class SendMailDto {
  @IsEmail({}, { message: i18nValidationMessage(COMMON_MESSAGE.INVALID_EMAIL) })
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
  })
  to: string;

  @IsString()
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'subject',
    type: String,
    required: true,
  })
  subject: string;

  @IsString()
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'template',
    type: String,
    required: true,
  })
  template: string;

  @IsObject()
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'context',
    type: String,
    required: true,
  })
  context: any;
}
