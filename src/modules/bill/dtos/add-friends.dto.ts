import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

export class AddFriendsDto {
  @IsNumber()
  billId: number;

  @IsArray({ message: 'need array of friend ids' })
  @ArrayNotEmpty({ message: 'need to add atleast a friends.' })
  @IsNumber(undefined, { each: true, message: 'invalid friend ids' })
  friendIds: number[];
}
