import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
  Query
} from '@nestjs/common';
import { CreateCategoryDto } from '../categories/dto/category.dto';
import { Category } from '../entites/base.entity';
import { CategoriesService } from '../services/categories.service';
import { Role } from '../role/enums/role.enum';
import { Roles } from '../role/decorators/role.decorator'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @Roles(Role.Admin)
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(
    @Query('name') name: string = '',
    @Query('skip') skip: number,
    @Query('limit') limit: number
  ): Promise<Category[]> {
    let kwargs = {
      name: name || null
    }
    return this.categoriesService.findAll(kwargs, skip || 0, limit || 10);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
