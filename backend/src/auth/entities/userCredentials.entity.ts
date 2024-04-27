import { BaseEntity } from '../../entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

export type UserCredentialsId = string & { _brand: 'UserCredentialsId' };

@Entity()
export class UserCredentials extends BaseEntity<UserCredentialsId> {
  @OneToOne(() => User)
  @JoinColumn()
  public user: User;

  @Column()
  public password: string;
}
