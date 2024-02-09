import { v4 } from 'uuid';

import { User } from '@entities/User';

export const userMock: Omit<
  User,
  'hasId' | 'save' | 'remove' | 'reload' | 'recover' | 'softRemove'
>[] = [
  {
    id: v4(),
    name: 'John',
    is_active: true,
    username: 'john',
    password: 'testpassword',
    created_at: new Date(),
    updated_at: new Date(),
  },
];
