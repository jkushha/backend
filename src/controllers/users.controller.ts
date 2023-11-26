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
import { CreateUserDto } from '../users/dto/user.dto';
import { User } from '../entites/base.entity';
import { UsersService } from '../services/users.service';
import { Role } from '../role/enums/role.enum';
import { Roles } from '../role/decorators/role.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.Admin)
  findAll(
    @Query('user_name') user_name: string = '',
    @Query('first_name') first_name: string = '',
    @Query('last_name') last_name: string = '',
    @Query('role') role: string = '',
    @Query('active') active: boolean = null,
    @Query('skip') skip: number,
    @Query('limit') limit: number
  ): Promise<User[]> {
    let kwargs = {
      user_name: user_name || null,
      first_name: first_name || null,
      last_name: last_name || null,
      role: role || null,
      active: active || null,

    }
    return this.usersService.findAll(kwargs, skip || 0, limit || 10);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}