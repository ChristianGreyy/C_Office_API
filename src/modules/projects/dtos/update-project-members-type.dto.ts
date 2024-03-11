import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested, isString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { EUserProjectRole } from 'src/common/enums';
import { COMMON_MESSAGE } from 'src/messages';

export class UpdateProjectMembersTypeDto {
  @IsInt({ message: i18nValidationMessage(COMMON_MESSAGE.INVALID) })
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'userId',
    type: Number,
    required: true,
  })
  userId: number;

  @IsEnum(EUserProjectRole, { message: i18nValidationMessage(COMMON_MESSAGE.INVALID) })
  @IsNotEmpty({ message: i18nValidationMessage(COMMON_MESSAGE.NOT_EMPTY) })
  @ApiProperty({
    name: 'role',
    type: String,
    required: true,
  })
  role: EUserProjectRole;
}
