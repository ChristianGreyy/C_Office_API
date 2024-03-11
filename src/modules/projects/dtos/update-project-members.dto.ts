import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { UpdateProjectMembersTypeDto } from './update-project-members-type.dto';

export class UpdateProjectMembersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @Type(() => UpdateProjectMembersTypeDto)
  @ApiProperty({
    name: 'members',
    type: [UpdateProjectMembersTypeDto],
    required: true,
  })
  members: UpdateProjectMembersTypeDto[];
}
