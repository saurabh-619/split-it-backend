import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreOutput } from './../common/dtos/output.dto';
import { FriendRequestStatus } from './../common/types';
import { User } from './../user/entities/User.entity';
import { UserService } from './../user/user.service';
import { AcknowledgeFriendRequestOutput } from './dtos/acknowledge-friend-request.dto';
import { GetFriendsOutput } from './dtos/get-friends.dto';
import { GetPendingRequestsOuput } from './dtos/get-pending-requests';
import { GetFriendRequestBetweenTwoOutput } from './dtos/get-request-between-two.dto';
import { FriendRequest } from './entities/friend-request.entity';

@Injectable()
export class FriendRequestService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepo: Repository<FriendRequest>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    this.logger = new Logger(FriendRequestService.name);
  }

  async getPendingRequests(user: User): Promise<GetPendingRequestsOuput> {
    try {
      const friendRequests = await this.friendRequestRepo.findAndCount({
        where: {
          requestee: {
            id: user.id,
          },
          status: FriendRequestStatus.PENDING,
        },
        relations: ['requester', 'requestee'],
      });
      return {
        ok: true,
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

  async getFriendRequestBetweenTwoUsers(
    userId1: number,
    userId2: number,
  ): Promise<GetFriendRequestBetweenTwoOutput> {
    try {
      const request = await this.friendRequestRepo
        .createQueryBuilder('request')
        .leftJoinAndSelect('request.requester', 'requester')
        .leftJoinAndSelect('request.requestee', 'requestee')
        .where('requester.id = :userId1', { userId1 })
        .andWhere('requestee.id = :userId2', { userId2 })
        .orWhere('requester.id = :userId2', { userId2 })
        .andWhere('requestee.id = :userId1', { userId1 })
        .getOne();

      console.log({ request });

      return { ok: true, status: 200, request };
    } catch (e) {
      this.logger.error(e.message);
      return { ok: false, status: 500, error: "couldn't find the request" };
    }
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

      const request = await this.friendRequestRepo.findOne({
        where: [
          {
            requestee: {
              id: requesteeId,
            },
            requester: {
              id: requester.id,
            },
          },
          {
            requestee: {
              id: requester.id,
            },
            requester: {
              id: requesteeId,
            },
          },
        ],
        relations: ['requester', 'requestee'],
      });

      if (request !== null) {
        request.status = FriendRequestStatus.PENDING;
        request.requester = requester;
        request.requestee = requestee;
        await this.friendRequestRepo.save(request);
      } else {
        const newRequest = this.friendRequestRepo.create({
          requester: requester,
          requestee,
        });

        await this.friendRequestRepo.insert(newRequest);
      }

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

  async changeFriendRequestStatus(
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

      // check if valid request
      // 1. pending requests can only be accepted | rejected | seen
      // 2. accepted or rejected requests can only beunfriend
      // 3. accepted request cant be rejected and vice versa
      // 4. unfriended requests cant be accepted | rejected | seen | pending
      if (
        // 1
        (request.status === FriendRequestStatus.PENDING &&
          status === FriendRequestStatus.UNFRIENDED) ||
        // 2
        ([FriendRequestStatus.ACCEPTED, FriendRequestStatus.REJECTED].includes(
          request.status,
        ) &&
          [FriendRequestStatus.PENDING, FriendRequestStatus.SEEN].includes(
            status,
          )) ||
        // 3
        (request.status === FriendRequestStatus.ACCEPTED &&
          status === FriendRequestStatus.REJECTED) ||
        (request.status === FriendRequestStatus.REJECTED &&
          status === FriendRequestStatus.ACCEPTED) ||
        request.status === FriendRequestStatus.UNFRIENDED
      ) {
        console.log({
          error: `not valid request to proceed {${request.status}}:{${status}}`,
        });
        return {
          ok: false,
          status: 400,
          error: 'not valid request to proceed',
        };
      }

      // check if user is allowed to proceed
      // 1. status to be changed to = "ACCEPTED"|"REJECTED"|"SEEN" => requestee.id === user.id (only requestee can accept or reject or seen the pending request)
      // 2. status to be changed to = "UNFRIENDED" => requestee.id === user.id || requester.id === user.id  (requestee or requester can unfriend the accepted request)

      if (
        // 1
        ([
          FriendRequestStatus.ACCEPTED,
          FriendRequestStatus.REJECTED,
          FriendRequestStatus.SEEN,
        ].includes(status) &&
          user.id !== request.requesteeId) ||
        // 2
        (status === FriendRequestStatus.UNFRIENDED &&
          ![request.requesteeId, request.requesterId].includes(user.id))
      ) {
        return {
          ok: false,
          status: 400,
          error: 'current user not allowed to proceed the request',
        };
      }

      request.status = status;
      await this.friendRequestRepo.save(request);

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

  async getFriends(user: User): Promise<GetFriendsOutput> {
    try {
      const friendRequests = await this.friendRequestRepo
        .createQueryBuilder('fr')
        .leftJoinAndSelect('fr.requester', 'requester')
        .leftJoinAndSelect('fr.requestee', 'requestee')
        .where('fr.requestee.id = :id', {
          id: user.id,
        })
        .andWhere('fr.status = :status', {
          status: FriendRequestStatus.ACCEPTED,
        })
        .orWhere('fr.requester.id = :id', { id: user.id })
        .andWhere('fr.status = :status', {
          status: FriendRequestStatus.ACCEPTED,
        })
        .getMany();

      const friends = friendRequests.map((request) =>
        request.requester.id === user.id
          ? request.requestee
          : request.requester,
      );

      return {
        ok: true,
        status: 200,
        count: friends.length ?? 0,
        friends,
      };
    } catch (e) {
      this.logger.error(e.message);
      return {
        ok: false,
        status: 500,
        error: "couldn't find the friends",
      };
    }
  }
}
