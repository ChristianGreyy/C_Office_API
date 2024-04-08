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
import { Category } from '@prisma/client';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { PermissionDecorator } from '../../common/decorators/permission.decorator';
import { EUserPermission, EUserRole } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { IPagination } from 'src/interfaces/response.interface';
import { CATEGORY_MESSAGE } from 'src/messages';
import { LocalesService } from '../locales/locales.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { GetCategoriesDto } from './dtos/get-categories.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoriesService } from './categoies.service';

@ApiHeader({
  name: 'X-MyHeader',
  description: 'Custom header',
})
@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly localesService: LocalesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.CREATE_CATEGORY)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<{
    message: string;
    data: Category;
  }> {
    return {
      message: this.localesService.translate(
        CATEGORY_MESSAGE.CREATE_CATEGORY_SUCCESS,
      ),
      data: await this.categoriesService.createCategory(createCategoryDto),
    };
  }

  @Put(':categoryId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.UPDATE_CATEGORY)
  async updateCategory(
    @Param('categoryId') categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<{
    message: string;
    data: Category;
  }> {
    return {
      message: this.localesService.translate(
        CATEGORY_MESSAGE.UPDATE_CATEGORY_SUCCESS,
      ),
      data: await this.categoriesService.updateCategory(
        categoryId,
        updateCategoryDto,
      ),
    };
  }

  @Get(':categoryId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_CATEGORY)
  async getCategory(
    @Param('categoryId') categoryId: number,
  ): Promise<Category> {
    return this.categoriesService.getCategory(categoryId);
  }

  @Delete(':categoryId')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.DELETE_CATEGORY)
  async deleteCategory(@Param('categoryId') categoryId: number): Promise<{
    message: string;
    data: Category;
  }> {
    return {
      message: this.localesService.translate(
        CATEGORY_MESSAGE.DELETE_CATEGORY_SUCCESS,
      ),
      data: await this.categoriesService.deleteCategory(categoryId),
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN])
  @PermissionDecorator(EUserPermission.GET_PRIORITIES)
  async getCategories(
    @Query() getCategoriesDto: GetCategoriesDto,
  ): Promise<IPagination<Category>> {
    return this.categoriesService.getCategories(getCategoriesDto);
  }
}
