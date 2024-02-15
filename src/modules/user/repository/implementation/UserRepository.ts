import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@entities/User.entity';
import { CreateUserDTO } from '@modules/user/dto/create-user.dto';
import { UpdateUserDTO } from '@modules/user/dto/update-user.dto';

import { IUserRepository } from '../IUserRepository';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async create(data: CreateUserDTO): Promise<User> {
    return this.repository.create(data);
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    return (await this.repository.update({ id }, data)) as unknown as User;
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete({ id });
  }

  async findOneById(id: string): Promise<User> {
    return await this.repository.findOneBy({ id });
  }

  async exists(id: string): Promise<boolean> {
    return await this.repository.existsBy({ id });
  }
}
