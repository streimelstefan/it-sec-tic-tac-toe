import {
  Injectable,
  forwardRef,
  Inject,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokensDto } from '../dto/authTokens.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { AuthContextDto } from '../dto/authContext.dto';
import { User, UserId } from '../../user/entities/user.entity';
import { RefreshTokenDto } from '../dto/refreshToken.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken, RefreshTokenId } from '../entities/refreshToken.entity';
import { Configuration } from '../../configuration/configuration';
import { InjectConfig } from '@hydromerce/orange';

@Injectable()
export class TokenService {
  private readonly reqlogger = new Logger(TokenService.name);

  public constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
    @InjectConfig()
    private readonly config: Configuration,
  ) { }

  public async createTokenBundleFor(user: User): Promise<AuthTokensDto> {
    const tokenBundle = {
      accessToken: await this.createAccessToken(user),
      refreshToken: await this.createRefreshToken(user),
    };

    this.reqlogger.debug(`Created token bundle for user ${user.userName}.`);
    return tokenBundle;
  }

  public async useRefreshToken(
    refreshToken: RefreshTokenDto,
  ): Promise<RefreshToken> {
    const token = await this.findOneRefreshToken(refreshToken.internalId);

    token.usedAt = new Date();

    const usedToken = await this.refreshTokensRepository.save(token);

    this.reqlogger.log(`Used refresh token ${refreshToken}.`);

    return usedToken;
  }

  public async findOneRefreshToken(
    internalId: RefreshTokenId,
  ): Promise<RefreshToken> {
    const token = await this.refreshTokensRepository.findOne({
      where: { internalId },
      relations: { user: true },
    });

    if (!token) {
      this.reqlogger.warn(`Unable to find refresh token ${internalId}.`);
      throw new NotFoundException('Unable to find refresh token in database.');
    }

    this.reqlogger.debug(`Found refresh token ${internalId}.`);

    return token;
  }

  public async removeRefreshTokensOf(user: UserId): Promise<void> {
    const tokens = await this.findRefreshTokensOf(user);

    await this.refreshTokensRepository.remove(tokens);

    this.reqlogger.log(`Removed all refresh tokens of user ${user}.`);
  }

  public async validateAndExtract<T>(token: string): Promise<T> {
    try {
      const tokenData = (await this.jwtService.verifyAsync(token)) as T;

      this.reqlogger.log(`Validated token. Token is valid.`);

      return tokenData;
    } catch (e) {
      this.reqlogger.warn(`Validated token. Token is invalid: ${e?.message}`);
      throw new UnauthorizedException();
    }
  }

  public async extract<T>(token: string): Promise<T> {
    try {
      const tokenData = (await this.jwtService.decode(token)) as T;

      this.reqlogger.debug(`Extracted token.`);

      return tokenData;
    } catch (e) {
      this.reqlogger.error(`Got malformed token. Unable to extract.`);
      throw new InternalServerErrorException(e);
    }
  }

  private async findRefreshTokensOf(user: UserId): Promise<RefreshToken[]> {
    return this.refreshTokensRepository.find({
      where: {
        user: {
          internalId: user,
        }
      }
    });
  }

  private async createAccessToken(user: User): Promise<string> {
    const tokenLifetime = this.config.auth.accessTokenLifetime;
    const payload: AuthContextDto = {
      userName: user.userName,
      isAdmin: user.isAdmin,
      internalId: user.internalId,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: tokenLifetime,
    });

    this.reqlogger.debug(
      `Created access token for user ${user.userName} with lifetime ${tokenLifetime}.`,
    );
    return token;
  }

  private async createRefreshToken(user: User): Promise<string> {
    const token = this.refreshTokensRepository.create({
      user,
    });
    const tokenLifetime = this.config.auth.refreshTokenLifetime;

    let savedToken: RefreshToken;
    try {
      savedToken = await this.refreshTokensRepository.save(token);
    } catch (e) {
      this.reqlogger.error(
        `Unable to save refresh token for user ${user.userName}.`,
        { error: e },
      );
      throw new InternalServerErrorException(e);
    }

    const payload: RefreshTokenDto = {
      internalId: savedToken.internalId,
      user: savedToken.user.internalId,
    };

    const signedToken = this.jwtService.sign(payload, {
      expiresIn: tokenLifetime,
    });

    this.reqlogger.debug(
      `Created refresh token for user ${user.userName} with lifetime ${tokenLifetime}.`,
    );
    return signedToken;
  }
}
