import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UserCredentials } from './entities/userCredentials.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenService } from './services/token.service';
import { RefreshToken } from './entities/refreshToken.entity';
import { Configuration } from '../configuration/configuration';
import { ConfigurationService } from '@hydromerce/orange';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy, TokenService],
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    TypeOrmModule.forFeature([UserCredentials, RefreshToken]),
    JwtModule.registerAsync({
      inject: [ConfigurationService],
      useFactory: (configService: ConfigurationService<Configuration>) => {
        return {
          secret: configService.config.auth.jwtSecret,
          signOptions: {
            expiresIn: configService.config.auth.accessTokenLifetime,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
