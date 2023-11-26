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
import { CreateProductDto } from '../products/dto/product.dto';
import { Product } from '../entites/base.entity';
import { ProductsService } from '../services/products.service';
import { Role } from '../role/enums/role.enum';
import { Roles } from '../role/decorators/role.decorator';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @Roles(Role.Admin)
    create(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return this.productsService.create(createProductDto);
    }

    @Get()
    findAll(
        @Query('name') name: string = '',
        @Query('price') price: number = 0,
        @Query('quantity') quantity: number = 0,
        @Query('categories_ids') categories_ids: [],
        @Query('skip') skip: number,
        @Query('limit') limit: number
    ): Promise<Product[]> {
        let kwargs = {
            name: name || null,
            price: price || null,
            quantity: quantity || null,
            categories_ids: categories_ids.length || null
        }
        return this.productsService.findAll(kwargs, skip || 0, limit || 10);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        return this.productsService.findOne(id);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.productsService.remove(id);
    }
}
