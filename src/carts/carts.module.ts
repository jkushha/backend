import { Module } from '@nestjs/common';
import { CartsController } from '../controllers/carts.controller';
import { CartsService } from '../services/carts.service';
import { Cart } from 'src/entites/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Cart])],
  controllers: [CartsController],
  providers: [CartsService,   {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },]
})
export class CartsModule {}
