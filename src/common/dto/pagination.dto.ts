import { IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationParamsDto {
  @ApiProperty({
    description: 'offset',
    required: false,
    type: String,
    default: null,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  offset?: number;

  @ApiProperty({
    description: 'limit',
    required: false,
    type: String,
    default: null,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'page',
    required: false,
    type: String,
    default: null,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'startingId',
    required: false,
    type: String,
    default: null,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  startingId?: number;

  @ApiProperty({
    description: 'search',
    required: false,
    type: String,
    default: null,
  })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  search?: string;


  @ApiProperty({
    description: 'sort',
    required: false,
    type: String,
    default: null,
  })
  @IsOptional()
  @IsString()
  sort?: string;
}
