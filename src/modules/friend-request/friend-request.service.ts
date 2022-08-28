import { CoreOutput, FriendRequestStatus } from '@common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserService } from '@user';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { AcknowledgeFriendRequestOutput } from './dtos/acknowledge-friend-request.dto';
import { GetPendingRequestsOuput } from './dtos/get-pending-requests';
import { FriendRequest } from './entities/friend-request.entity';

@Injectable()
export class FriendRequestService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly userService: UserService,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepo: Repository<FriendRequest>,
  ) {}

  async getPendingRequests(user: User): Promise<GetPendingRequestsOuput> {
    try {
      console.log({ user });
      const friendRequests = await this.friendRequestRepo.findAndCount({
        where: {
          requestee: {
            id: user.id,
          },
        },
        relations: ['requester', 'requestee'],
      });
      return {
        ok: false,
        status: 200,
        count: friendRequests[1],
        friendRequests: friendRequests[0],
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't find pending friend requests",
      };
    }
  }

  async getFriendRequestById(id: number): Promise<FriendRequest> {
    return this.friendRequestRepo.findOne({
      where: {
        id,
      },
      //   relations: ['requestee', 'requester'],
      loadRelationIds: true,
    });
  }

  async sendFriendRequest(
    requester: User,
    requesteeId: number,
  ): Promise<CoreOutput> {
    try {
      const requestee = await this.userService.getUserById(requesteeId);

      if (requestee === null) {
        return {
          ok: false,
          status: 400,
          error: "friend doesn't exists",
        };
      }

      const request = this.friendRequestRepo.create({
        requester: requester,
        requestee,
      });

      await this.friendRequestRepo.insert(request);

      return {
        ok: true,
        status: 200,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't send the friend request",
      };
    }
  }

  async acceptFriendRequest(
    user: User,
    requestId: number,
    status: FriendRequestStatus,
  ): Promise<AcknowledgeFriendRequestOutput> {
    try {
      const request = await this.getFriendRequestById(requestId);

      if (request === null) {
        return {
          ok: false,
          status: 400,
          error: "friend request doesn't exists",
        };
      }

      // check if user is requestee
      if (user.id !== request.requesteeId) {
        return {
          ok: false,
          status: 400,
          error: 'authenticated user not allowed to proceed the request',
        };
      }

      request.status = status;
      const requestResult = await this.friendRequestRepo.save(request);

      console.log({ requestResult });

      return {
        ok: true,
        status: 200,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't send the friend request",
      };
    }
  }
}
