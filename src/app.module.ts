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
    UserModule,
    WalletModule,
    MoneyRequestModule,
    FriendRequestModule,
    ItemModule,
    BillModule,
    TransactionModule,
  ],
})
export class AppModule {}
