import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationParamsDto } from 'src/common/dto';
import { EUserStatus } from 'src/common/enums/users.enum';

export class GetUsersDto extends PaginationParamsDto {
  @IsOptional()
  @ApiProperty({ enum: EUserStatus })
  status: EUserStatus;
}
