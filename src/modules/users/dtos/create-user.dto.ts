import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Matches,
  MaxLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PASSWORD_REGEX, PHONE_VN_REGEX } from 'src/constants';
import { EUserStatus } from 'src/common/enums/users.enum';
import { COMMON_MESSAGE, USER_MESSAGE } from 'src/messages';

export class CreateUserDto {
  @IsEmail({}, { message: i18nValidationMessage(COMMON_MESSAGE.INVALID_EMAIL) })
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
  })
  email: string;

  @Matches(PHONE_VN_REGEX, {
    message: i18nValidationMessage(COMMON_MESSAGE.INVALID_PHONE),
  })
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'phone',
    type: String,
    required: true,
  })
  phone: string;

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

  @MaxLength(30, {
    message: i18nValidationMessage(COMMON_MESSAGE.MAX),
  })
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'firstName',
    type: String,
    required: true,
  })
  firstName: string;

  @MaxLength(30, {
    message: i18nValidationMessage(COMMON_MESSAGE.MAX),
  })
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'lastName',
    type: String,
    required: true,
  })
  lastName: string;

  @IsEnum(EUserStatus, {
    message: i18nValidationMessage(COMMON_MESSAGE.INVALID),
  })
  @ApiProperty({
    enum: EUserStatus,
    name: 'status',
    type: String,
    required: true,
  })
  status = EUserStatus.ACTIVE;
}
