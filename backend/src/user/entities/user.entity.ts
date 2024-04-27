import {
  IsBoolean,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';

export type UserId = string & { _brand: 'UserId' };

@Entity()
export class User extends BaseEntity<UserId> {
  @Column()
  @MinLength(2)
  @MaxLength(32)
  public firstName: string;

  @Column()
  @MinLength(2)
  @MaxLength(32)
  public lastName: string;

  @Column({
    unique: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  public userName?: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  public email: string;

  @IsBoolean()
  @Column()
  public isAdmin: boolean;

  @IsBoolean()
  @Column({ default: true })
  public isActive: boolean;
}
