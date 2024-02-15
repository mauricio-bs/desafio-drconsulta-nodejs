import { User } from '@entities/User.entity';

import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';

export abstract class IUserService {
  abstract create(data: CreateUserDTO): Promise<User>;
  abstract update(id: string, data: UpdateUserDTO): Promise<User>;
  abstract delete(id: string): Promise<void>;
  abstract findOneById(id: string): Promise<User>;
}
