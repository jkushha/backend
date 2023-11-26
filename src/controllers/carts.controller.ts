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
import { CreateCartDto } from '../carts/dto/cart.dto';
import { Cart } from '../entites/base.entity';
import { CartsService } from '../services/carts.service';
import { Role } from '../role/enums/role.enum';
import { Roles } from '../role/decorators/role.decorator'
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('carts')
export class CartsController {
    constructor(private readonly cartsService: CartsService) { }

    @Post()
    @Public()
    create(@Body() createCartDto: CreateCartDto): Promise<Cart> {
        return this.cartsService.create(createCartDto);
    }

    @Get()
    @Roles(Role.Admin)
    findAll(
        @Query('user_id') user_id: number = 0,
        @Query('products_ids') products_ids: [] = [],
        @Query('skip') skip: number,
        @Query('limit') limit: number
    ): Promise<Cart[]> {
        let kwargs = {
            user_id: user_id || null,
            products_ids: products_ids.length || null
        }
        return this.cartsService.findAll(kwargs, skip || 0, limit || 10);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Cart> {
        return this.cartsService.findOne(id);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.cartsService.remove(id);
    }
}
