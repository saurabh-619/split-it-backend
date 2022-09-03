import { CoreOutput, FriendRequestStatus } from '@common';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class AcknowledgeFriendRequestDto {
  @IsNumber()
  requestId: number;

  @IsString()
  @IsEnum(FriendRequestStatus, { message: 'not valid status' })
  status: FriendRequestStatus;
}

export class AcknowledgeFriendRequestOutput extends CoreOutput {}
