import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PASSWORD_REGEX } from 'src/constants';
import { COMMON_MESSAGE, USER_MESSAGE } from 'src/messages';

export class ChangePasswordDto {
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

  @Matches(PASSWORD_REGEX, {
    message: i18nValidationMessage(USER_MESSAGE.INVALID_PASSWORD),
  })
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'confirmPassword',
    type: String,
    required: true,
  })
  confirmPassword: string;
}
