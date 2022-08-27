import { CoreEntity } from '@common';
import { IsNumber, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

@Entity('item')
export class Item extends CoreEntity {
  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  description: string;

  @Column({ type: 'double precision' })
  @IsNumber()
  price: number;

  @Column()
  @IsString()
  image: string;
}
