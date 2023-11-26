import { Module } from '@nestjs/common';
import { OrdersController } from '../controllers/orders.controller';
import { OrdersService } from '../services/orders.service';
import { Order } from 'src/entites/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [OrdersController],
  providers: [OrdersService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },]
})
export class OrdersModule {}
