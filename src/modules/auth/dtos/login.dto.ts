import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    Matches
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PASSWORD_REGEX } from 'src/constants';
import { COMMON_MESSAGE } from 'src/messages';

export class LoginDto {
  @IsEmail({}, { message: i18nValidationMessage(COMMON_MESSAGE.INVALID_EMAIL) })
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
  })
  email: string;

  @Matches(PASSWORD_REGEX, {
    message: i18nValidationMessage('users.INVALID_PASSWORD'),
  })
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'password',
    type: String,
    required: true,
  })
  password: string;
}
