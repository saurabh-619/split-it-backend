import { UserModule } from '@user';
import { Module } from '@nestjs/common';
import { FriendRequest } from './entities/friend-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestController } from './friend-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest]), UserModule],
  providers: [FriendRequestService],
  controllers: [FriendRequestController],
})
export class FriendRequestModule {}
