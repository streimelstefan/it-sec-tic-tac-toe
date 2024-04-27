import { Expose, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPort,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';

export class AuthConfiguration {
  @IsDefined()
  @IsString()
  @Expose()
  jwtSecret: string;

  @IsOptional()
  @IsString()
  @Expose()
  accessTokenLifetime: string = '5m';

  @IsOptional()
  @IsString()
  @Expose()
  refreshTokenLifetime: string = '7d';

  @IsOptional()
  @IsNumber()
  @Expose()
  saltRounds: number = 10;
}

export class DatabaseConfiguration {
  @IsDefined()
  @IsString()
  @Expose()
  host: string;

  @IsDefined()
  @IsNumber()
  @Expose()
  port: number;

  @IsDefined()
  @IsString()
  @Expose()
  username: string;

  @IsDefined()
  @IsString()
  @Expose()
  password: string;

  @IsDefined()
  @IsString()
  @Expose()
  database: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  synchronize: boolean = false;
}

export class Configuration {
  @ValidateNested()
  @Expose()
  database: DatabaseConfiguration = new DatabaseConfiguration();

  @ValidateNested()
  @Expose()
  auth: AuthConfiguration = new AuthConfiguration();
}
