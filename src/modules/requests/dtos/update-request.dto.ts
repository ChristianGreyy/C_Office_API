import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ERequestStatus } from 'src/common/enums';
import { COMMON_MESSAGE } from 'src/messages';

export class UpdateRequestDto {
  @IsEnum(ERequestStatus, {
    message: i18nValidationMessage(COMMON_MESSAGE.INVALID),
  })
  @ApiProperty({
    enum: ERequestStatus,
    name: 'status',
    type: String,
    required: true,
  })
  status: ERequestStatus;
}
