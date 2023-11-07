import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LocalesService } from '../locales/locales.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersDto } from './dtos/get-users.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

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
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return;
  }

  @Get()
  async getUsers(@Query() getUsersDto: GetUsersDto): Promise<any> {
    throw new NotFoundException(
      this.localesService.translate('users.TEST', 'vn'),
    );
    return this.usersService.getUsers();
  }
}
