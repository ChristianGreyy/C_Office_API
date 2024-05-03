import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { EDeviceType } from 'src/constants';

export class CreateDeviceDto {
  @ApiProperty({
    type: String,
    description: 'Device id (unique)',
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({
    type: String,
    description: `The device type must be in  [${EDeviceType.toString()}]`,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(EDeviceType, {
    message: `The device type must be in  [${EDeviceType.toString()}]`,
  })
  deviceType: string;

  @ApiProperty({
    type: String,
    description: 'Fcm Token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
