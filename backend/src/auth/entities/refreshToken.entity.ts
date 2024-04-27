import { BaseEntity } from '../../entities/base.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

export type RefreshTokenId = string & { _brand: 'RefreshTokenId' };

@Entity()
export class RefreshToken extends BaseEntity<RefreshTokenId> {
  @ManyToOne(() => User)
  public user: User;

  @Column({
    nullable: true,
  })
  public usedAt?: Date;
}
