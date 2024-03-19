import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { COMMON_MESSAGE } from 'src/messages';

export class CreateIssueDto {
  @IsString({ message: i18nValidationMessage(COMMON_MESSAGE.INVALID) })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'subject',
    type: String,
    required: true,
    example: 'CRUD User'
  })
  subject: string;

  @IsString({ message: i18nValidationMessage(COMMON_MESSAGE.INVALID) })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'input',
    type: String,
    required: true,
    example: 'Create, update, delete, get user'
  })
  input: string;

  @IsDateString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'startDate',
    type: String,
    required: true,
    example: '2023-03-17T10:54:00.000Z'
  })
  startDate: string;

  @IsDateString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'dueDate',
    type: String,
    required: true,
    example: '2023-03-17T10:54:00.000Z'
  })
  dueDate: string;

  @IsNumber()
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'estimateTime',
    type: Number,
    required: true,
    example: 2.5
  })
  estimateTime: number;

  @IsString({ message: i18nValidationMessage(COMMON_MESSAGE.INVALID) })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'output',
    type: String,
    required: true,
    example: 'done!'
  })
  output: string;

  @IsNumber()
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'assignId',
    type: Number,
    required: true,
    example: 5
  })
  assignId: number;

  @IsNumber()
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'priorityId',
    type: Number,
    required: true,
    example: 5
  })
  priorityId: number;

  @IsNumber()
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'trackerId',
    type: Number,
    required: true,
    example: 3
  })
  trackerId: number;

  @IsNumber()
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'statusId',
    type: Number,
    required: true,
    example: 1
  })
  statusId: number;

  @IsNumber()
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'categoryId',
    type: Number,
    required: true,
    example: 3
  })
  categoryId: number;

  @IsNumber()
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'projectId',
    type: Number,
    required: true,
    example: 2
  })
  projectId: number;
}
