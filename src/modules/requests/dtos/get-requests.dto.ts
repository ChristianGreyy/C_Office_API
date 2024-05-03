import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationParamsDto } from '../../../common/dto';
import { Transform } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { COMMON_MESSAGE } from 'src/messages';
import { ApiProperty } from '@nestjs/swagger';

export class GetRequestsDto extends PaginationParamsDto {
    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsOptional()
    @ApiProperty({
      name: 'type',
      type: String,
      required: false,
      example: 'absence'
    })
    type: string;

    @IsString()
    @Transform(({ value }) => value?.trim())
    @IsOptional()
    @ApiProperty({
      name: 'status',
      type: String,
      required: false,
      example: 'pending'
    })
    status: string;
}
