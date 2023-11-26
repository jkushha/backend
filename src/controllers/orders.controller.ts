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
import { CreateOrderDto } from '../orders/dto/order.dto';
import { Order } from '../entites/base.entity';
import { OrdersService } from '../services/orders.service';
import { Role } from '../role/enums/role.enum';
import { Roles } from '../role/decorators/role.decorator'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @Roles(Role.Admin)
  findAll(
    @Query('total_price') total_price: number = 0,
    @Query('cart_id') cart_id: number = 0,
    @Query('skip') skip: number,
    @Query('limit') limit: number
  ): Promise<Order[]> {
    let kwargs = {
      total_price: total_price || null,
      cart_id: cart_id || null
    }
    return this.ordersService.findAll(kwargs, skip || 0, limit || 10);
  }

  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ordersService.remove(id);
  }
}