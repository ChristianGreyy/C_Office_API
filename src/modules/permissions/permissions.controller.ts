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
import { Permission } from '@prisma/client';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { EUserPermission, EUserRole } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { IPagination } from 'src/interfaces/response.interface';
import { ROLE_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { GetPermissionsDto } from './dtos/get-permissions.dto';
import { UpdatePermissionDto } from './dtos/update-permission.dto';
import { PermissionsService } from './permissions.service';
import { PermissionDecorator } from '../../common/decorators/permission.decorator';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'Custom header',
})
@ApiTags('permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly localesService: LocalesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.CREATE_PERMISSION)
  async createPermission(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<{
    message: string;
    data: Permission;
  }> {
    return {
      message: this.localesService.translate(ROLE_MESSAGE.CREATE_ROLE_SUCCESS),
      data: await this.permissionsService.createPermission(createPermissionDto),
    };
  }

  @Put(':permissionId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.UPDATE_PERMISSION)
  async updatePermission(
    @Param('permissionId') permissionId: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<{
    message: string;
    data: Permission;
  }> {
    return {
      message: this.localesService.translate(ROLE_MESSAGE.UPDATE_ROLE_SUCCESS),
      data: await this.permissionsService.updatePermission(
        permissionId,
        updatePermissionDto,
      ),
    };
  }

  @Get(':permissionId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_PERMISSION)
  async getPermission(
    @Param('permissionId') permissionId: number,
  ): Promise<Permission> {
    return this.permissionsService.getPermission(permissionId);
  }

  @Delete(':permissionId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.DELETE_PERMISSION)
  async deletePermission(@Param('permissionId') permissionId: number): Promise<{
    message: string;
    data: Permission;
  }> {
    return {
      message: this.localesService.translate(ROLE_MESSAGE.UPDATE_ROLE_SUCCESS),
      data: await this.permissionsService.deletePermission(permissionId),
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.USER])
  @PermissionDecorator(EUserPermission.GET_PERMISSIONS)
  async getPermissions(
    @Query() getPermissionsDto: GetPermissionsDto,
  ): Promise<IPagination<Permission>> {
    return this.permissionsService.getPermissions(getPermissionsDto);
  }
}
