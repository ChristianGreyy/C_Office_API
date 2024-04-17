import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationParamsDto } from '../../../common/dto';
import { Transform } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { COMMON_MESSAGE } from 'src/messages';
import { ApiProperty } from '@nestjs/swagger';

export class GetEmployeeAttendancesDto extends PaginationParamsDto {
    @IsDateString()
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
    @IsOptional()
    @ApiProperty({
      name: 'dateTime',
      type: String,
      required: false,
      example: '2024-05-23'
    })
    dateTime: string;
}
