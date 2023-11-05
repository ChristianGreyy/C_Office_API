import { Controller, Get, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { LocalesService } from '../locales/locales.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private localesService: LocalesService,
  ) {}

  @Get()
  async getUsers(): Promise<any> {
    throw new NotFoundException(
      this.localesService.translate('users.TEST', 'vn'),
    );

    return this.usersService.getUsers();
  }
}
