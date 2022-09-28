import { CoreOutput } from './../../common/dtos/output.dto';
import { FriendRequestStatus } from './../../common/types';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class AcknowledgeFriendRequestDto {
  @IsNumber()
  requestId: number;

  @IsString()
  @IsEnum(FriendRequestStatus, { message: 'not valid status' })
  status: FriendRequestStatus;
}

export class AcknowledgeFriendRequestOutput extends CoreOutput {}
