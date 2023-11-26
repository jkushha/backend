import { Product, User } from '../../entites/base.entity';
import { ProductDto } from "src/products/dto/product.dto";
import { OrderDto } from "../../orders/dto/order.dto"
import { UserDto } from "../../users/dto/user.dto"
import { IsOptional } from "class-validator";

export class CreateCartDto {
  @IsOptional()
  isActive : boolean

  user: User;

  products: Product []

}

export class CartDto {

  id: number;
  
  isActive: boolean;

  user: UserDto;

  order: OrderDto;

  products: ProductDto [];

}
