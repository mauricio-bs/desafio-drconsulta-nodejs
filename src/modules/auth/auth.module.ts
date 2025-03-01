import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@entities/User.entity';

import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './service/auth.service';
import { IAuthService } from './service/Iauth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.getOrThrow('JWT_EXPIRES') },
        verifyOptions: { ignoreExpiration: false },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: IAuthService, useClass: AuthService },
    JwtStrategy,
    ConfigService,
  ],
  exports: [{ provide: IAuthService, useClass: AuthService }],
})
export class AuthModule {}
