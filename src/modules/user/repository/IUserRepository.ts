import { User } from '@entities/User.entity';

import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';

export abstract class IUserRepository {
  abstract create(data: CreateUserDTO): Promise<User>;
  abstract update(id: string, data: UpdateUserDTO): Promise<User>;
  abstract softDelete(id: string): Promise<void>;
  abstract findOneById(id: string): Promise<User>;
  abstract exists(id: string): Promise<boolean>;
}
