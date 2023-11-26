
import { Category} from '../../entites/base.entity';
import { IsOptional, IsNotEmpty } from "class-validator";

export class ProductBase {
  @IsOptional()
  name: string;

  @IsOptional()
  price: number;

  @IsOptional()
  quantity: number;

  @IsOptional()
  categories: Category []

}

export class CreateProductDto extends ProductBase{
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  categories: Category []

}

export class ProductDto extends ProductBase{

  id: string;

}
