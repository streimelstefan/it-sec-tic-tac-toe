import { OmitType, PickType } from '@nestjs/swagger';
import { RefreshToken } from '../entities/refreshToken.entity';
import { UserId } from '../../user/entities/user.entity';

export class RefreshTokenDto extends PickType(RefreshToken, [
  'internalId',
] as const) {
  public user: UserId;
}
