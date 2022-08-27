import { Module } from '@nestjs/common';
import { FriendRequest } from './entities/friend-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest])],
})
export class FriendRequestModule {}
