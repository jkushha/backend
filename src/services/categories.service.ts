import { Injectable , HttpException, HttpStatus} from '@nestjs/common';
import { CreateCategoryDto, CategoryDto } from '../categories/dto/category.dto';
import { Category } from '../entites/base.entity';
import { masterQueryRunner, slaveQueryRunner } from '../db/db_config'

@Injectable()
export class CategoriesService {
  constructor() {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new Category();

    try {
      await masterQueryRunner.connect();

      category.name = createCategoryDto.name;
  
      await masterQueryRunner.manager.save(category)

    } catch (error) {

      await masterQueryRunner.release();

      throw new HttpException('Failed to create category duo to'+error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await masterQueryRunner.release();

      return category;
    }
  }

  async findAll(kwargs: object , skip: number = 0, limit: number = 0): Promise<Category[]> {
    let categories = null;

    let filters = Object.fromEntries(Object.entries(kwargs).filter(([_, v]) => v != null));

    try {
      await slaveQueryRunner.connect();

      let query  = slaveQueryRunner.manager.getRepository(Category).createQueryBuilder("category");

      if ('name' in filters)
      {
        query = query.where("category.name = :name", { name: filters.name });
      }

      if(skip)
      {
        query = query.skip(skip);
      }

      if(limit)
      {
        query = query.take(limit);
      }

      categories = query.getMany();

    } catch (error) {

      await slaveQueryRunner.release();

      throw new HttpException('Failed to fetch categories duo to'+error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await slaveQueryRunner.release();

      return categories;
    }
  }

  async findOne(id: number): Promise<Category> {
    let category = null;
    try {
      await slaveQueryRunner.connect();
  
      category = await slaveQueryRunner.manager.findOneBy(Category,{ id: id });

    } catch (error) {

      await slaveQueryRunner.release();

      throw new HttpException('Failed to fetch category duo to'+error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await slaveQueryRunner.release();

      return category;
    }  
  }

  async findOneByCategoryName(name: string): Promise<Category> {
    let category = null;
    try {
      await slaveQueryRunner.connect();
  
      category = await slaveQueryRunner.manager.findOneBy(Category,{ name: name });

    } catch (error) {

      await slaveQueryRunner.release();

      throw new HttpException('Failed to fetch category duo to'+error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await slaveQueryRunner.release();

      return category;
    }  
  }

  async remove(id: number): Promise<void> {
    try {
      await masterQueryRunner.connect();
  
      await masterQueryRunner.manager.delete(Category,{ id: id });

    } catch (error) {

      await masterQueryRunner.release();

      throw new HttpException('Failed to delete category duo to'+error, HttpStatus.EXPECTATION_FAILED);

    } finally {

      await masterQueryRunner.release();

    } 
  }
}
