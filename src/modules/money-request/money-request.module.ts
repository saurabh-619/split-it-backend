import { UserModule } from '@user';
import { MoneyRequest } from './entities/money-request.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyRequestService } from './money-request.service';
import { MoneyRequestController } from './money-request.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([MoneyRequest]),
    forwardRef(() => UserModule),
  ],
  providers: [MoneyRequestService],
  controllers: [MoneyRequestController],
})
export class MoneyRequestModule {}
