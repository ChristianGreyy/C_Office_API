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
import { EUserGender, EUserStatus } from '../../../common/enums/users.enum';
import { PASSWORD_REGEX, PHONE_VN_REGEX } from 'src/constants';
import { COMMON_MESSAGE } from 'src/messages';

export class UpdateUserDto {
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
  @IsOptional()
  @ApiProperty({
    name: 'password',
    type: String,
    required: true,
  })
  password: string;

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

  @IsEnum(EUserGender, {
    message: i18nValidationMessage(COMMON_MESSAGE.INVALID),
  })
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'gender',
    type: String,
    required: true,
  })
  gender: EUserGender;

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
