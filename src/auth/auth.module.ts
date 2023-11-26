import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.AUTH_JWT_SECRET,
      signOptions: { expiresIn: process.env.AUTH_JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,    
    {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },],
  exports: [AuthService],

})
export class AuthModule {}
