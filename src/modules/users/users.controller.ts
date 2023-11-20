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
import { User } from '@prisma/client';
import { USER_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersDto } from './dtos/get-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { IPagination } from 'src/interfaces/response.interface';
import { Auth } from 'src/common/decorators/auth.decorator';
import { EUserRole } from 'src/common/enums';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'Custom header',
})
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly localesService: LocalesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @Auth([EUserRole.ADMIN])
  async createUser(@Body() createUserDto: CreateUserDto): Promise<{
    message: string;
    data: User;
  }> {
    return {
      message: this.localesService.translate(USER_MESSAGE.CREATE_USER_SUCCESS),
      data: await this.usersService.createUser(createUserDto),
    };
  }

  @Put(':userId')
  @UseGuards(AuthGuard)
  @Auth([EUserRole.ADMIN])
  async updateUser(
    @Param('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{
    message: string;
    data: User;
  }> {
    return {
      message: this.localesService.translate(USER_MESSAGE.UPDATE_USER_SUCCESS),
      data: await this.usersService.updateUser(userId, updateUserDto),
    };
  }

  @Get(':userId')
  @UseGuards(AuthGuard)
  @Auth([EUserRole.ADMIN])
  async getUser(@Param('userId') userId: number): Promise<User> {
    return this.usersService.getUser(userId);
  }

  @Delete(':userId')
  @UseGuards(AuthGuard)
  @Auth([EUserRole.ADMIN])
  async deleteUser(@Param('userId') userId: number): Promise<{
    message: string;
    data: User;
  }> {
    return {
      message: this.localesService.translate(USER_MESSAGE.UPDATE_USER_SUCCESS),
      data: await this.usersService.deleteUser(userId),
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  @Auth([EUserRole.ADMIN])
  async getUsers(
    @Query() getUsersDto: GetUsersDto,
  ): Promise<IPagination<User>> {
    return this.usersService.getUsers(getUsersDto);
  }
}
