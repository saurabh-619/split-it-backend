import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import {
  configModuleOptions,
  typeOrmAsyncOptions,
  loggerOptions,
} from '@config';
import {
  ValidationModule,
  HttpModule,
  JwtModule,
  UserModule,
  BillModule,
  FriendRequestModule,
  ItemModule,
  MoneyRequestModule,
  TransactionModule,
  WalletModule,
} from '@modules';
import { __prod__ } from '@utils';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync(typeOrmAsyncOptions),
    LoggerModule.forRoot(loggerOptions),
    JwtModule.forRoot({ secretKey: process.env.JWT_SECRET_KEY }),
    UserModule,
    WalletModule,
    MoneyRequestModule,
    FriendRequestModule,
    ItemModule,
    BillModule,
    TransactionModule,
    ValidationModule,
    HttpModule,
  ],
})
export class AppModule {}
