import { ItemModule } from './../item/item.module';
import { BillModule } from './../bill/bill.module';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillItemController } from './bill-item.controller';
import { BillItemService } from './bill-item.service';
import { BillItem } from './entities/bill-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BillItem]),
    UserModule,
    BillModule,
    ItemModule,
  ],
  providers: [BillItemService],
  controllers: [BillItemController],
})
export class BillItemModule {}
