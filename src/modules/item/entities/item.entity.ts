import { CoreEntity } from './../../common/enitites/core.entity';
import { Column, Entity } from 'typeorm';

@Entity('item')
export class Item extends CoreEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'double precision' })
  price: number;

  @Column({ nullable: true })
  image?: string;
}
