import { User } from '@user';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationModule } from '@validation';
import { HttpModule } from '@http';
import { WalletModule } from '@wallet';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ValidationModule,
    HttpModule,
    WalletModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
