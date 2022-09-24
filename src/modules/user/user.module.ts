import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationModule } from '@validation';
import { HttpModule } from '@http';
import { WalletModule } from '@wallet';
import { AuthMiddleware } from '@auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ValidationModule,
    HttpModule,
    WalletModule,
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
