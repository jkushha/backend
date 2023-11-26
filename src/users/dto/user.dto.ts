import { IsOptional, IsNotEmpty } from "class-validator";

export class UserBase {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  username: string;

  @IsOptional()
  password: string;

  @IsOptional()
  role: string;

  @IsOptional()
  isActive: boolean;
}

export class CreateUserDto extends UserBase {

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class UserDto extends UserBase {

  id: number;

}