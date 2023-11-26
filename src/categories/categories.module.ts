import { Module } from '@nestjs/common';
import { CategoriesController } from '../controllers/categories.controller';
import { CategoriesService } from '../services/categories.service';
import { Category } from 'src/entites/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },]
})
export class CategoriesModule {}
