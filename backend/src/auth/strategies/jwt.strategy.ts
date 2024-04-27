import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthContextDto } from '../dto/authContext.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Configuration } from '../../configuration/configuration';
import { InjectConfig } from '@hydromerce/orange';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(@InjectConfig() config: Configuration) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.auth.jwtSecret,
    });
  }

  public async validate(payload: AuthContextDto) {
    return plainToInstance(AuthContextDto, payload);
  }
}
