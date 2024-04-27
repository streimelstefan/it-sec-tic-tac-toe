import { Module } from '@nestjs/common';
import { ConfigurationModule, ConfigurationService } from '@hydromerce/orange';
import { Configuration } from './configuration/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigurationModule.forRoot({
      configClass: Configuration,
      useDotenv: false,
      classTransformerOptions: {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      },
      classValidatorOptions: {
        whitelist: true,
      },
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigurationService<Configuration>) => ({
        type: 'postgres',
        host: configService.config.database.host,
        port: configService.config.database.port,
        username: configService.config.database.username,
        password: configService.config.database.password,
        database: configService.config.database.database,
        synchronize: configService.config.database.synchronize,
        autoLoadEntities: true,
      }),
      inject: [ConfigurationService],
    }),
    AuthModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
