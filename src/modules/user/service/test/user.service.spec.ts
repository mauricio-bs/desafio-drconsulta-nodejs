import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { DatabaseModule } from '@database/database.module';
import { User } from '@entities/User.entity';
import { CreateUserDTO } from '@modules/user/dto/create-user.dto';
import { UpdateUserDTO } from '@modules/user/dto/update-user.dto';

import { IUserService } from '../Iuser.service';
import { Userservice } from '../user.service';
import { userMock } from './mockedUser';

describe('UserServicce', () => {
  let service: IUserService;
  let repository: Repository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        TypeOrmModule.forFeature([User]),
      ],
      providers: [
        ConfigService,
        { provide: IUserService, useClass: Userservice },
        { provide: getRepositoryToken(User), useClass: User },
      ],
    }).compile();

    service = module.get<IUserService>(IUserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    describe('successes', () => {
      it('should create user', async () => {
        // Data
        const data: CreateUserDTO = {
          name: 'Test user',
          is_active: true,
          username: 'test',
          password: '12345',
          confirm_password: '12345',
        };

        // Mocked functions
        jest.spyOn(repository, 'create').mockResolvedValueOnce({
          id: v4(),
          ...data,
          created_at: new Date(),
          updated_at: new Date(),
        });

        // Execution
        const sut = await service.create(data);

        // Audition
        expect(sut).toMatchObject(data);
        expect(sut).toHaveProperty('id');
        expect(repository.create).toHaveBeenCalledTimes(1);
        expect(repository.create).toHaveBeenCalledWith(data);
      });
    });
  });

  describe('update', () => {
    describe('exceptions', () => {
      it('should fail to update unexistent user', async () => {
        // Data
        const id = userMock[0].id;
        const data: UpdateUserDTO = { name: 'updated name' };

        // Mocked functions
        jest.spyOn(repository, 'existsBy').mockResolvedValueOnce(false);
        jest
          .spyOn(repository, 'update')
          .mockResolvedValueOnce({ ...userMock[0], ...data });

        // Execution | Audition
        expect(service.update(id, data)).rejects.toThrow('User not found');
        expect(
          service.update(id, data),
        ).rejects.toThrowErrorMatchingInlineSnapshot();
        expect(repository.existsBy).toHaveBeenCalledTimes(2);
        expect(repository.existsBy).toHaveBeenCalledWith({ id });
        expect(repository.update).not.toHaveBeenCalled();
      });
    });

    describe('success', () => {
      it('should update user', async () => {
        // Data
        const id = userMock[0].id;
        const data: UpdateUserDTO = { name: 'updated name' };

        // Mocked functions
        jest.spyOn(repository, 'existsBy').mockResolvedValueOnce(false);
        jest
          .spyOn(repository, 'update')
          .mockResolvedValueOnce({ ...userMock[0], ...data });

        // Execution
        const sut = await service.update(id, data);

        // Audition
        expect(sut).toMatchObject(data);
        expect(sut).toHaveProperty('id', id);
        expect(repository.existsBy).toHaveBeenCalledTimes(1);
        expect(repository.existsBy).toHaveBeenCalledWith({ id });
        expect(repository.update).toHaveBeenCalledTimes(1);
        expect(repository.update).toHaveBeenCalledWith({ id }, data);
      });
    });
  });

  describe('delete', () => {
    describe('exceptions', () => {
      it('should fail to delete unexistent user', async () => {
        // Data
        const id = userMock[0].id;

        // Mocked functions
        jest.spyOn(repository, 'existsBy').mockResolvedValueOnce(false);
        jest.spyOn(repository, 'softDelete').mockResolvedValueOnce(undefined);

        // Execution | Audition
        expect(service.delete(id)).rejects.toThrow('User not found');
        expect(service.delete(id)).rejects.toThrowErrorMatchingInlineSnapshot();
        expect(repository.existsBy).toHaveBeenCalledTimes(2);
        expect(repository.existsBy).toHaveBeenCalledWith({ id });
        expect(repository.softDelete).not.toHaveBeenCalled();
      });
    });

    describe('success', () => {
      it('should delete user', async () => {
        // Data
        const id = userMock[0].id;

        // Mocked functions
        jest.spyOn(repository, 'existsBy').mockResolvedValueOnce(false);
        jest.spyOn(repository, 'softDelete').mockResolvedValueOnce(undefined);

        // Execution
        const sut = await service.delete(id);

        // Audition
        expect(sut).toBeUndefined();
        expect(repository.existsBy).toHaveBeenCalledTimes(1);
        expect(repository.existsBy).toHaveBeenCalledWith({ id });
        expect(repository.softDelete).toHaveBeenCalledTimes(1);
        expect(repository.softDelete).toHaveBeenCalledWith({ id });
      });
    });
  });

  describe('findOneById', () => {
    describe('success', () => {
      it('should find user', async () => {
        // Data
        const id = userMock[0].id;

        // Mocked functions
        jest
          .spyOn(repository, 'findOneBy')
          .mockImplementationOnce(
            async ({ where }) =>
              userMock.find((user) => user.id === where?.id) as User,
          );

        // Execution
        const sut = await service.findOneById(id);

        // Audition
        expect(sut).toHaveProperty('id', id);
        expect(repository.findOneBy).toHaveBeenCalledTimes(1);
        expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      });
    });
  });
});
