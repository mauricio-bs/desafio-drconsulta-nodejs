import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@entities/User.entity';

import { UserController } from './controller/user.controller';
import { UserRepository } from './repository/implementation/UserRepository';
import { IUserRepository } from './repository/IUserRepository';
import { IUserService } from './service/Iuser.service';
import { Userservice } from './service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    { provide: IUserService, useClass: Userservice },
    { provide: IUserRepository, useClass: UserRepository },
  ],
})
export class UserModule {}
