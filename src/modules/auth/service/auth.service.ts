import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';

import { User } from '@entities/User';

import { SignInDTO } from '../dto/signin.dto';
import { IAuthService } from './Iauth.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async sigin(data: SignInDTO): Promise<string> {
    const user = await this.repository.findOneBy({
      username: data.username,
      is_active: true,
    });
    if (!user || !(await compare(data.password, user.password)))
      throw new BadRequestException('User or password does not match');

    return this.jwtService.sign({ name: user.name }, { subject: user.id });
  }
}
