import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LocalesService } from '../locales/locales.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersDto } from './dtos/get-users.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dtos/update-user.dto';
import { USER_MESSAGE } from 'src/messages';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'Custom header',
})
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private localesService: LocalesService,
  ) {}

  @Post()
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

  @Get()
  async getUsers(@Query() getUsersDto: GetUsersDto): Promise<User> {
    throw new NotFoundException(
      this.localesService.translate('users.PASSWORD_NOT_MATCH', 'vn'),
    );
    return this.usersService.getUsers();
  }
}
