import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationParamsDto } from '../../../common/dto';

export class GetSprintsDto extends PaginationParamsDto {}
