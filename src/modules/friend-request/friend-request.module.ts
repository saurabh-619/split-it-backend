import { UserModule } from './../user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequest]),
    forwardRef(() => UserModule),
  ],
  providers: [FriendRequestService],
  controllers: [FriendRequestController],
  exports: [FriendRequestService],
})
export class FriendRequestModule {}
