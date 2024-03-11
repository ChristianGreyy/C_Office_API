import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { COMMON_MESSAGE } from 'src/messages';

export class UpdateUserProjectDto {
  @IsInt({ message: i18nValidationMessage(COMMON_MESSAGE.INVALID) })
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'userId',
    type: Number,
    required: true,
  })
  userId: number;
}
