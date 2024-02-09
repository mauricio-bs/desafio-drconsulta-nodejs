import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';

import { User } from '@entities/User';

import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { IUserService } from './Iuser.service';

@Injectable()
export class Userservice implements IUserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async create(data: CreateUserDTO): Promise<User> {
    delete data.confirm_password;
    data.password = await hash(data.password, 8);

    return this.repository.create(data);
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    if (!(await this.repository.existsBy({ id })))
      throw new NotFoundException('User not found');

    return (await this.repository.update({ id }, data)) as unknown as User;
  }

  async delete(id: string): Promise<void> {
    if (!(await this.repository.existsBy({ id })))
      throw new NotFoundException('User not found');

    await this.repository.softDelete({ id });
  }

  async findOneById(id: string): Promise<User> {
    return await this.repository.findOneBy({ id });
  }
}
