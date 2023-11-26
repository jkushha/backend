import { IsOptional, IsNotEmpty } from "class-validator";

export class CategoryBaseDto {

  name: string;

  @IsOptional()
  createdDate: Date

  @IsOptional()
  updatedDate: Date
}

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;
}

export class CategoryDto extends CategoryBaseDto{

  id: string;

}
