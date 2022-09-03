import { BillModule, ItemModule, UserModule } from '@modules';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillItemController } from './bill-item.controller';
import { BillItemService } from './bill-item.service';
import { BillItem } from './entities/bill-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BillItem]),
    forwardRef(() => UserModule),
    forwardRef(() => BillModule),
    forwardRef(() => ItemModule),
  ],
  providers: [BillItemService],
  controllers: [BillItemController],
})
export class BillItemModule {}
