import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { configModuleOptions } from './config/dotenv.config';
import { jwtOptions } from './config/jwt.config';
import { loggerOptions } from './config/logger.config';
import { throllerOptions } from './config/throttler.config';
import { typeOrmAsyncOptions } from './config/typeorm.config';

import { AuthModule } from './modules/auth/auth.module';
import { BillItemModule } from './modules/bill-item/bill-item.module';
import { BillModule } from './modules/bill/bill.module';
import { FriendRequestModule } from './modules/friend-request/friend-request.module';
import { ItemModule } from './modules/item/item.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { MoneyRequestModule } from './modules/money-request/money-request.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { UserModule } from './modules/user/user.module';
import { ValidationModule } from './modules/validation/validation.module';
import { WalletModule } from './modules/wallet/wallet.module';

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
  controllers: [AppController],
})
export class AppModule {}
