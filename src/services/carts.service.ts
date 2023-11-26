import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCartDto } from '../carts/dto/cart.dto';
import { Cart } from '../entites/base.entity';
import { masterQueryRunner, slaveQueryRunner } from '../db/db_config'

@Injectable()
export class CartsService {
  constructor() { }

  async create(CreateCartDto: CreateCartDto): Promise<Cart> {
    const cart = new Cart();

    try {
      await masterQueryRunner.connect();

      cart.user = CreateCartDto.user;
      cart.products = CreateCartDto.products;

      await masterQueryRunner.manager.save(cart)

    } catch (error) {

      await masterQueryRunner.release();

      throw new HttpException('Failed to create cart duo to' + error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await masterQueryRunner.release();

      return cart;
    }
  }

  async findAll(kwargs: object, skip: number = 0, limit: number = 0): Promise<Cart[]> {
    let carts = null;

    let filters = Object.fromEntries(Object.entries(kwargs).filter(([_, v]) => v != null));

    try {
      await slaveQueryRunner.connect();

      let query = slaveQueryRunner.manager.getRepository(Cart).createQueryBuilder("cart");

      if ('user_id' in filters) {
        query = query.where("cart.user_id = :id", { id: filters.user_id });
      }

      if ('products_ids' in filters) {
        query = query.innerJoinAndSelect(
          "cart.products",
          "product",
          "product.id IN :ids",
          { ids: filters.products_ids },
        )
      }

      if (skip) {
        query = query.skip(skip);
      }

      if (limit) {
        query = query.take(limit);
      }

      carts = query.getMany();

    } catch (error) {

      await slaveQueryRunner.release();

      throw new HttpException('Failed to fetch carts duo to' + error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await slaveQueryRunner.release();

      return carts;
    }
  }

  async findOne(id: number): Promise<Cart> {
    let cart = null;
    try {
      await slaveQueryRunner.connect();

      cart = await slaveQueryRunner.manager.findOne(Cart, {
        relations: {
          products: true,
          user: true
        }, where: { id: id }
      });

    } catch (error) {

      await slaveQueryRunner.release();

      throw new HttpException('Failed to fetch cart duo to' + error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await slaveQueryRunner.release();

      return cart;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await masterQueryRunner.connect();

      await masterQueryRunner.manager.delete(Cart, { id: id });

    } catch (error) {

      await masterQueryRunner.release();

      throw new HttpException('Failed to delete cart duo to' + error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await masterQueryRunner.release();

    }
  }
}


