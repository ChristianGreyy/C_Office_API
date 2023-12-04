import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { COMMON_MESSAGE } from 'src/messages';

export class CreateRoleDto {
  @IsString({ message: i18nValidationMessage(COMMON_MESSAGE.INVALID) })
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'name',
    type: String,
    required: true,
  })
  name: string;

  @IsArray({ message: i18nValidationMessage(COMMON_MESSAGE.INVALID) })
  @IsInt({ each: true, message: i18nValidationMessage(COMMON_MESSAGE.INVALID) })
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'permissionIds',
    type: Array,
    required: true,
  })
  permissionIds: number[];
}
