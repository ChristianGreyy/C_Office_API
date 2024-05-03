import { IsObject, IsOptional, IsString } from 'class-validator';

export class SaveNotificationDto {
  @IsString()
  action: string;
}
