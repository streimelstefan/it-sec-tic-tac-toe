import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto extends OmitType(User, [
  'internalId',
  'createdAt',
  'updatedAt',
  'version',
] as const) {
  @IsString()
  @IsStrongPassword()
  public password: string;
}
