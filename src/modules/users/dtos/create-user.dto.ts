import { ApiProperty } from '@nestjs/swagger';
import { EUserStatus } from 'src/enums/users/users.enum';

export class CreateUserDto {
  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
  })
  email: string;

  @ApiProperty({
    name: 'username',
    type: String,
    required: true,
  })
  username: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ enum: EUserStatus })
  status: EUserStatus;
}
