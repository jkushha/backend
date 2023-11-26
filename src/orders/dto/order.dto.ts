import { Cart } from '../../entites/base.entity';

export class CreateOrderDto {

  total_price: number;

  cart: Cart;
}

export class OrderDto {

  id: string;

  total_price: number;

}
