import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PASSWORD_REGEX, PHONE_VN_REGEX } from 'src/constants';
import { EUserGender, EUserStatus } from '../../../common/enums/users.enum';
import { COMMON_MESSAGE, USER_MESSAGE } from 'src/messages';

export class CreateUserDto {
  @MaxLength(30, {
    message: i18nValidationMessage(COMMON_MESSAGE.MAX),
  })
  @IsEmail({}, { message: i18nValidationMessage(COMMON_MESSAGE.INVALID_EMAIL) })
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
  })
  email: string;

  @MaxLength(30, {
    message: i18nValidationMessage(COMMON_MESSAGE.MAX),
  })
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

  @MaxLength(30, {
    message: i18nValidationMessage(COMMON_MESSAGE.MAX),
  })
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

  @MaxLength(30, {
    message: i18nValidationMessage(COMMON_MESSAGE.MAX),
  })
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

  @MaxLength(30, {
    message: i18nValidationMessage(COMMON_MESSAGE.MAX),
  })
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

  @IsEnum(EUserGender, {
    message: i18nValidationMessage(COMMON_MESSAGE.INVALID),
  })
  @ApiProperty({
    enum: EUserGender,
    name: 'Gender',
    type: String,
    required: true,
  })
  gender = EUserGender.MALE

  @IsInt()
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'positionId',
    type: String,
    required: true,
  })
  positionId: number;

  @IsInt()
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'universityId',
    type: String,
    required: true,
  })
  universityId: number;

  @IsInt()
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'levelId',
    type: String,
    required: true,
  })
  levelId: number;
}
