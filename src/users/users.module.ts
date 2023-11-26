import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entites/base.entity'
import { UsersService } from '../services/users.service';
import { UsersController } from '../controllers/users.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
