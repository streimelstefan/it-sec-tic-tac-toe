import { UserId } from '../../user/entities/user.entity';

export class AuthContextDto {
  public userName: string;

  public isAdmin: boolean;

  public internalId: UserId;
}
