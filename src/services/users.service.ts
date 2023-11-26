import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/user.dto';
import { User } from '../entites/base.entity';
import { masterQueryRunner, slaveQueryRunner } from '../db/db_config'

@Injectable()
export class UsersService {
  constructor() { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();

    try {
      await masterQueryRunner.connect();

      user.firstName = createUserDto.firstName;

      user.lastName = createUserDto.lastName;

      user.userName = createUserDto.username;

      user.password = createUserDto.password;

      user.role = createUserDto.role

      await masterQueryRunner.manager.save(user)

    } catch (error) {

      await masterQueryRunner.release();

      throw new HttpException('Failed to create user duo to' + error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await masterQueryRunner.release();

      return user;
    }
  }

  async findAll(kwargs: object, skip: number = 0, limit: number = 0): Promise<User[]> {
    let users = null;

    let filters = Object.fromEntries(Object.entries(kwargs).filter(([_, v]) => v != null));

    try {
      await slaveQueryRunner.connect();

      let query = slaveQueryRunner.manager.getRepository(User).createQueryBuilder("user").where("user.isActive = :active", { active: true });;

      if ('user_name' in filters) {
        query = query.andWhere("user.userName = :name", { name: filters.user_name });
      }

      if ('first_name' in filters) {
        query = query.andWhere("user.firstName = :name", { name: filters.first_name });
      }

      if ('last_name' in filters) {
        query = query.andWhere("user.lastName = :name", { name: filters.last_name });
      }

      if ('role' in filters) {
        query = query.andWhere("user.role = :name", { name: filters.role });
      }

      if ('active' in filters) {
        query = query.andWhere("user.isActive = :active", { active: filters.active });
      }

      if (skip) {
        query = query.skip(skip);
      }

      if (limit) {
        query = query.take(limit);
      }

      users = query.getMany();

    } catch (error) {

      await slaveQueryRunner.release();

      throw new HttpException('Failed to fetch users duo to' + error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await slaveQueryRunner.release();

      return users;
    }
  }

  async findOne(id: number): Promise<User> {
    let user = null;
    try {
      await slaveQueryRunner.connect();

      user = await slaveQueryRunner.manager.findOneBy(User, { id: id });

    } catch (error) {

      await slaveQueryRunner.release();

      throw new HttpException('Failed to fetch user duo to' + error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await slaveQueryRunner.release();

      return user;
    }
  }

  async findOneByUserName(username: string): Promise<User> {
    let user = null;
    try {
      await slaveQueryRunner.connect();

      user = await slaveQueryRunner.manager.findOneBy(User, { userName: username });

    } catch (error) {

      await slaveQueryRunner.release();

      throw new HttpException('Failed to fetch user duo to' + error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await slaveQueryRunner.release();

      return user;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await masterQueryRunner.connect();

      await masterQueryRunner.manager.delete(User, { id: id });

    } catch (error) {

      await masterQueryRunner.release();

      throw new HttpException('Failed to delete user duo to' + error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await masterQueryRunner.release();

    }
  }
}
