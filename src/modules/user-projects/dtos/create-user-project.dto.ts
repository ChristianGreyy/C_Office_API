import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { COMMON_MESSAGE } from 'src/messages';

export class CreateUserProjectDto {
  @IsInt({ message: i18nValidationMessage(COMMON_MESSAGE.INVALID) })
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'userId',
    type: Number,
    required: true,
  })
  userId: number;

  @IsInt({ message: i18nValidationMessage(COMMON_MESSAGE.INVALID) })
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'projectId',
    type: Number,
    required: true,
  })
  projectId: number;

  @IsString({ message: i18nValidationMessage(COMMON_MESSAGE.INVALID) })
  @MaxLength(30, { message: i18nValidationMessage(COMMON_MESSAGE.MAX) })
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'role',
    type: String,
    required: true,
  })
  role: string;
}
