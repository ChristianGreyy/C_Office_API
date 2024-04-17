import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { COMMON_MESSAGE } from 'src/messages';

export class CreateEmployeeAttendanceDto {
  @IsDateString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @IsOptional()
  @ApiProperty({
    name: 'dateTime',
    type: String,
    required: true,
    example: '2024-05-23T10:54:00.000Z'
  })
  dateTime: string;
}
