import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { COMMON_MESSAGE } from 'src/messages';

export class CreateProjectDto {
  @IsString({ message: i18nValidationMessage(COMMON_MESSAGE.INVALID) })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'name',
    type: String,
    required: true,
  })
  name: string;
}
