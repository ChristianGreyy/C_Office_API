import { ApiProperty } from '@nestjs/swagger';
import { EUserStatus } from 'src/enums/users/users.enum';

export class GetUsersDto {
  @ApiProperty({ enum: EUserStatus })
  status: EUserStatus;
}
