import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto, ProductDto } from '../products/dto/product.dto';
import { Product } from '../entites/base.entity';
import { masterQueryRunner, slaveQueryRunner } from '../db/db_config'

@Injectable()
export class ProductsService {
  constructor() { }

  async create(CreateProductDto: CreateProductDto): Promise<Product> {
    const product = new Product();

    try {
      await masterQueryRunner.connect();

      product.name = CreateProductDto.name;
      product.price = CreateProductDto.price;
      product.quantity = CreateProductDto.quantity;
      product.categories = CreateProductDto.categories;

      await masterQueryRunner.manager.save(product)

    } catch (error) {

      await masterQueryRunner.release();

      throw new HttpException('Failed to create product duo to' + error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await masterQueryRunner.release();

      return product;
    }
  }

  async findAll(kwargs: object, skip: number = 0, limit: number = 0): Promise<Product[]> {
    let products = null;

    let filters = Object.fromEntries(Object.entries(kwargs).filter(([_, v]) => v != null));

    try {
      await slaveQueryRunner.connect();

      let query = slaveQueryRunner.manager.getRepository(Product).createQueryBuilder("product").where("product.quantity > :name", { name: 0 });

      if ('name' in filters) {
        query = query.andWhere("product.name = :name", { name: filters.name });
      }

      if ('price' in filters) {
        query = query.andWhere("product.price > :name", { name: filters.price });

      }

      if ('quantity' in filters) {
        query = query.andWhere("product.quantity > :name", { name: filters.quantity });
      }

      if ('categories_ids' in filters) {
        query = query.innerJoinAndSelect(
          "product.categories",
          "category",
          "category.id IN :ids",
          { ids: filters.categories_ids },
        )
      }

      if (skip) {
        query = query.skip(skip);
      }

      if (limit) {
        query = query.take(limit);
      }

      products = query.getMany();

    } catch (error) {

      await slaveQueryRunner.release();

      throw new HttpException('Failed to fetch products duo to' + error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await slaveQueryRunner.release();

      return products;
    }
  }

  async findOne(id: number): Promise<Product> {
    let product = null;
    try {
      await slaveQueryRunner.connect();

      product = await slaveQueryRunner.manager.findOne(Product, {
        relations: {
          categories: true,
        }, where: { id: id }
      });

    } catch (error) {

      await slaveQueryRunner.release();

      throw new HttpException('Failed to fetch product duo to' + error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await slaveQueryRunner.release();

      return product;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await masterQueryRunner.connect();

      await masterQueryRunner.manager.delete(Product, { id: id });

    } catch (error) {

      await masterQueryRunner.release();

      throw new HttpException('Failed to delete product duo to' + error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await masterQueryRunner.release();

    }
  }
}

