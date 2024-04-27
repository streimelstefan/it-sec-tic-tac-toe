import {
  Injectable,
  forwardRef,
  Inject,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserId } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';
import { UserCredentials } from '../entities/userCredentials.entity';
import { Repository } from 'typeorm';
import { AuthContextDto } from '../dto/authContext.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { AuthTokensDto } from '../dto/authTokens.dto';
import { TokenService } from './token.service';
import { RefreshTokenDto } from '../dto/refreshToken.dto';
import { Configuration } from '../../configuration/configuration';
import { InjectConfig } from '@hydromerce/orange';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,
    private readonly tokenService: TokenService,
    @InjectRepository(UserCredentials)
    private readonly userCredentialsRepository: Repository<UserCredentials>,
    @InjectConfig()
    private readonly config: Configuration,
  ) { }

  public async validateUser(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.usersService.findOneByUserName(username);

    if (!user.isActive) {
      this.logger.warn(`User ${username} is not active.`);
      return undefined;
    }

    const userCredentials = await this.findCredentialsOf(user.internalId);

    if (await bcrypt.compare(password, userCredentials.password)) {
      this.logger.log(`Validated user ${username}.`);
      return user;
    }

    this.logger.warn(`Failed to validate user ${username}.`);
    return undefined;
  }

  public async setUserPassword(user: User, password: string): Promise<void> {
    let userCredentials = await this.userCredentialsRepository.findOneBy({
      user: {
        internalId: user.internalId,
      }
    });

    const hashedPassword = await bcrypt.hash(
      password,
      this.config.auth.saltRounds,
    );

    if (!userCredentials) {
      userCredentials = this.userCredentialsRepository.create({
        user,
        password: hashedPassword,
      });
    } else {
      userCredentials.password = hashedPassword;
    }

    try {
      await this.userCredentialsRepository.save(userCredentials);
    } catch (error) {
      this.logger.error(
        `Failed to save new password for user ${user.userName}: ${error}`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  public async login(user: User): Promise<AuthTokensDto> {
    const tokenBundle = this.tokenService.createTokenBundleFor(user);
    this.logger.log(`Created token bundle for user ${user.userName}.`);
    return tokenBundle;
  }

  public async refreshTokens(
    authTokens: AuthTokensDto,
  ): Promise<AuthTokensDto> {
    const refreshTokenDto =
      await this.tokenService.validateAndExtract<RefreshTokenDto>(
        authTokens.refreshToken,
      );
    const accessToken = await this.tokenService.extract<AuthContextDto>(
      authTokens.accessToken,
    );

    const refreshToken = await this.tokenService.findOneRefreshToken(
      refreshTokenDto.internalId,
    );

    if (refreshToken.user.internalId !== accessToken.internalId) {
      this.logger.warn(
        `Refresh token and access token dont share the same user.`,
      );
      throw new BadRequestException();
    }

    if (refreshToken.usedAt) {
      this.logger.warn(`Refresh token has already been used.`);
      throw new BadRequestException();
    }

    await this.tokenService.useRefreshToken(refreshTokenDto);

    const tokenBundle = this.login(refreshToken.user);
    this.logger.log(`Refreshed tokens for user ${accessToken.userName}.`);

    return tokenBundle;
  }

  public async removeAuthDataOf(user: UserId): Promise<void> {
    const credentials = await this.findCredentialsOf(user);
    await this.userCredentialsRepository.remove(credentials);

    await this.tokenService.removeRefreshTokensOf(user);
    this.logger.log(`Removed all auth data of user ${user}.`);
  }


  private async findCredentialsOf(user: UserId): Promise<UserCredentials> {
    const userCredentials = await this.userCredentialsRepository.findOneBy({
      user: {
        internalId: user,
      },
    });

    if (!userCredentials) {
      this.logger.warn(`No credentials found for user ${user}.`);
      throw new NotFoundException();
    }

    return userCredentials;
  }
}
