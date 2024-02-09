import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@entities/User';

import { UserController } from './controller/user.controller';
import { IUserService } from './service/Iuser.service';
import { Userservice } from './service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [{ provide: IUserService, useClass: Userservice }],
})
export class UserModule {}
