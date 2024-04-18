import { IsNumber, IsOptional } from 'class-validator';
import { PaginationParamsDto } from '../../../common/dto';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetIssuesDto extends PaginationParamsDto {
    @ApiProperty({
        description: 'projectId',
        required: false,
        type: Number,
        default: null,
      })
      @IsOptional()
      @Transform(({ value }) => Number(value))
      @IsNumber()
      projectId?: number;  
      
      @ApiProperty({
        description: 'statusId',
        required: false,
        type: Number,
        default: null,
      })
      @IsOptional()
      @Transform(({ value }) => Number(value))
      @IsNumber()
      statusId?: number;  

      @ApiProperty({
        description: 'trackerId',
        required: false,
        type: Number,
        default: null,
      })
      @IsOptional()
      @Transform(({ value }) => Number(value))
      @IsNumber()
      trackerId?: number;  

      @ApiProperty({
        description: 'priorityId',
        required: false,
        type: Number,
        default: null,
      })
      @IsOptional()
      @Transform(({ value }) => Number(value))
      @IsNumber()
      priorityId?: number;  
}
