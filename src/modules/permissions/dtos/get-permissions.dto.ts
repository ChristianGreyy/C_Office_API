import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationParamsDto } from 'src/common/dto';

export class GetPermissionsDto extends PaginationParamsDto {}
