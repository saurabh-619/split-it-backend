import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthUser } from '../auth/auth.user.decorator';
import { User } from './../user/entities/User.entity';
import {
  AcknowledgeFriendRequestDto,
  AcknowledgeFriendRequestOutput,
} from './dtos/acknowledge-friend-request.dto';
import { GetPendingRequestsOuput } from './dtos/get-pending-requests';
import { BadRequesteeIdException } from './exceptions/index';
import { FriendRequestService } from './friend-request.service';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Get()
  async getPendingRequests(
    @AuthUser() user: User,
  ): Promise<GetPendingRequestsOuput> {
    return this.friendRequestService.getPendingRequests(user);
  }

  @Get('/friends')
  async getFriends(@AuthUser() user: User): Promise<GetPendingRequestsOuput> {
    return this.friendRequestService.getFriends(user);
  }

  @Post()
  async sendFriendRequest(
    @AuthUser() requester: User,
    @Body(
      'requesteeId',
      new ParseIntPipe({
        exceptionFactory() {
          return new BadRequesteeIdException();
        },
      }),
    )
    requesteeId: number,
  ): Promise<GetPendingRequestsOuput> {
    return this.friendRequestService.sendFriendRequest(requester, requesteeId);
  }

  @Patch()
  async changeFriendRequestStatus(
    @AuthUser() user: User,
    @Body() { requestId, status }: AcknowledgeFriendRequestDto,
  ): Promise<AcknowledgeFriendRequestOutput> {
    return this.friendRequestService.changeFriendRequestStatus(
      user,
      requestId,
      status,
    );
  }
}
