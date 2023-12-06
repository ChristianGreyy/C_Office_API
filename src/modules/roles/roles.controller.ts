import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { EUserPermission, EUserRole } from 'src/common/enums';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { IPagination } from 'src/interfaces/response.interface';
import { ROLE_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { GetRolesDto } from './dtos/get-roles.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { RolesService } from './roles.service';
import { PermissionDecorator } from 'src/common/decorators/permission.decorator';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'Custom header',
})
@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly localesService: LocalesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.CREATE_ROLE)
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<{
    message: string;
    data: Role;
  }> {
    return {
      message: this.localesService.translate(ROLE_MESSAGE.CREATE_ROLE_SUCCESS),
      data: await this.rolesService.createRole(createRoleDto),
    };
  }

  @Put(':roleId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.UPDATE_ROLE)
  async updateRole(
    @Param('roleId') roleId: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<{
    message: string;
    data: Role;
  }> {
    return {
      message: this.localesService.translate(ROLE_MESSAGE.UPDATE_ROLE_SUCCESS),
      data: await this.rolesService.updateRole(roleId, updateRoleDto),
    };
  }

  @Get(':roleId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_ROLE)
  async getRole(@Param('roleId') roleId: number): Promise<Role> {
    return this.rolesService.getRole(roleId);
  }

  @Delete(':roleId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.DELETE_ROLE)
  async deleteRole(@Param('roleId') roleId: number): Promise<{
    message: string;
    data: Role;
  }> {
    return {
      message: this.localesService.translate(ROLE_MESSAGE.UPDATE_ROLE_SUCCESS),
      data: await this.rolesService.deleteRole(roleId),
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_ROLES)
  async getRoles(
    @Query() getRolesDto: GetRolesDto,
  ): Promise<IPagination<Role>> {
    return this.rolesService.getRoles(getRolesDto);
  }
}
