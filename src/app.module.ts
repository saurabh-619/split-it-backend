import { Bill } from '@bill/entities/bill.entity';
import { BillItem } from '@bill-item/entities/bill-item.enitity';
import { FriendRequest } from '@friend-request/enitities/friend-request.entity';
import { Item } from '@item/entities/item.entity';
import { ItemModule } from '@item/item.module';
import { MoneyRequest } from '@money-request/entities/money-request.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '@transaction/entities/transaction.entity';
import { User } from '@user/enitities/user.entity';
import { Wallet } from '@wallet/entities/wallet.entity';
import { LoggerModule } from 'nestjs-pino';
import { BillModule } from './bill/bill.module';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { MoneyRequestModule } from './money-request/money-request.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { __prod__ } from './utils/constant';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      ignoreEnvFile: __prod__,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: !__prod__,
      synchronize: !__prod__,
      entities: [
        User,
        Wallet,
        MoneyRequest,
        FriendRequest,
        Item,
        BillItem,
        Bill,
        Transaction,
      ],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        redact: ['req', 'res'],
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: `${new Date(Date.now()).toLocaleString()}`,
            singleLine: true,
          },
        },
      },
    }),
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
