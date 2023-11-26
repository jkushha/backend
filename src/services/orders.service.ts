import { Injectable , HttpException, HttpStatus} from '@nestjs/common';
import { CreateOrderDto } from '../orders/dto/order.dto';
import { Order } from '../entites/base.entity';
import { masterQueryRunner, slaveQueryRunner } from '../db/db_config'

@Injectable()
export class OrdersService {
  constructor() {}

  async create(CreateOrderDto: CreateOrderDto): Promise<Order> {
    const order = new Order();

    try {
      await masterQueryRunner.connect();

      order.total_price = CreateOrderDto.total_price;
      order.cart = CreateOrderDto.cart;
  
      await masterQueryRunner.manager.save(order)

    } catch (error) {

      await masterQueryRunner.release();

      throw new HttpException('Failed to create order duo to'+error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await masterQueryRunner.release();

      return order;
    }
  }

  async findAll(kwargs: object , skip: number = 0, limit: number = 0): Promise<Order[]> {
    let orders = null;

    let filters = Object.fromEntries(Object.entries(kwargs).filter(([_, v]) => v != null));

    try {
      await slaveQueryRunner.connect();

      let query  = slaveQueryRunner.manager.getRepository(Order).createQueryBuilder("order");

      if ('cart_id' in filters)
      {
        query = query.where("order.cart_id = :id", { id: filters.cart_id });
      }
      
      if ('total_price' in filters)
      {
        query = query.where("order.total_price > :val", { val: filters.total_price });
      }

      if(skip)
      {
        query = query.skip(skip);
      }

      if(limit)
      {
        query = query.take(limit);
      }

      orders = query.getMany();

    } catch (error) {

      await slaveQueryRunner.release();

      throw new HttpException('Failed to fetch orders duo to'+error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await slaveQueryRunner.release();

      return orders;
    }
  }

  async findOne(id: number): Promise<Order> {
    let order = null;
    try {
      await slaveQueryRunner.connect();
  
      order = await slaveQueryRunner.manager.findOne(Order,{  relations: {
        cart: true
    },  where: {id: id }});

    } catch (error) {

      await slaveQueryRunner.release();

      throw new HttpException('Failed to fetch order duo to'+error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await slaveQueryRunner.release();

      return order;
    }  
  }

  async remove(id: number): Promise<void> {
    try {
      await masterQueryRunner.connect();
  
      await masterQueryRunner.manager.delete(Order,{ id: id });

    } catch (error) {

      await masterQueryRunner.release();

      throw new HttpException('Failed to delete order duo to'+error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await masterQueryRunner.release();

    } 
  }
}


