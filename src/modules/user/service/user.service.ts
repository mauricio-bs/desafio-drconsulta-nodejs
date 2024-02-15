import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';

import { User } from '@entities/User.entity';

import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { IUserRepository } from '../repository/IUserRepository';
import { IUserService } from './Iuser.service';

@Injectable()
export class Userservice implements IUserService {
  constructor(private repository: IUserRepository) {}

  async create(data: CreateUserDTO): Promise<User> {
    delete data.confirm_password;
    data.password = await hash(data.password, 8);

    return this.repository.create(data);
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    if (!(await this.repository.exists(id)))
      throw new NotFoundException('User not found');

    return (await this.repository.update(id, data)) as unknown as User;
  }

  async delete(id: string): Promise<void> {
    if (!(await this.repository.exists(id)))
      throw new NotFoundException('User not found');

    await this.repository.softDelete(id);
  }

  async findOneById(id: string): Promise<User> {
    return await this.repository.findOneById(id);
  }
}
