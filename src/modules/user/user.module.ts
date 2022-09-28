import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyRequestModule } from '../money-request/money-request.module';
import { AuthMiddleware } from './../auth/auth.middleware';
import { FriendRequestModule } from './../friend-request/friend-request.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    FriendRequestModule,
    MoneyRequestModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/health', '/auth/login', '/auth/register', '/user/is-available')
      .forRoutes('*');
  }
}
