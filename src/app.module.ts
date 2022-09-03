import {
  configModuleOptions,
  jwtOptions,
  loggerOptions,
  throllerOptions,
  typeOrmAsyncOptions,
} from '@config';
import {
  AuthModule,
  BillModule,
  FriendRequestModule,
  HttpModule,
  ItemModule,
  JwtModule,
  MoneyRequestModule,
  TransactionModule,
  UserModule,
  ValidationModule,
  WalletModule,
  BillItemModule,
} from '@modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync(typeOrmAsyncOptions),
    LoggerModule.forRoot(loggerOptions),
    ThrottlerModule.forRoot(throllerOptions),
    JwtModule.forRoot(jwtOptions),
    UserModule,
    WalletModule,
    MoneyRequestModule,
    FriendRequestModule,
    ItemModule,
    BillModule,
    TransactionModule,
    ValidationModule,
    HttpModule,
    AuthModule,
    BillItemModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
