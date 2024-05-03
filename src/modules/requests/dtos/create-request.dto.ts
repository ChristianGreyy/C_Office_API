import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ERequestType } from 'src/common/enums';
import { COMMON_MESSAGE } from 'src/messages';

export class CreateRequestDto {
  @IsDateString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'startTime',
    type: String,
    required: true,
    example: '2024-05-23T10:54:00.000Z'
  })
  startTime: string;

  @IsDateString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'endTime',
    type: String,
    required: true,
    example: '2024-05-23T10:54:00.000Z'
  })
  endTime: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  // @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'note',
    type: String,
    required: true,
    example: 'To complete work'
  })
  note: string;

  @IsEnum(ERequestType, {
    message: i18nValidationMessage(COMMON_MESSAGE.INVALID),
  })
  @ApiProperty({
    enum: ERequestType,
    name: 'type',
    type: String,
    required: true,
  })
  type: ERequestType;
}
