import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { DatabaseModule } from '@database/database.module';
import { Company } from '@entities/Company';
import { CreateCompanyDTO } from '@modules/company/dto/create-company.dto';
import { UpdateCompanyDTO } from '@modules/company/dto/update-company.dto';

import { CompanyService } from '../company.service';
import { ICompanyService } from '../Icompany.service';
import { companyMock } from './company.mock';

describe('Company service', () => {
  let service: ICompanyService;
  let repository: Repository<Company>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        TypeOrmModule.forFeature([Company]),
      ],
      providers: [
        ConfigService,
        { provide: ICompanyService, useClass: CompanyService },
        { provide: getRepositoryToken(Company), useClass: Company },
      ],
    }).compile();

    service = module.get<ICompanyService>(ICompanyService);
    repository = module.get<Repository<Company>>(getRepositoryToken(Company));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    describe('successes', () => {
      it('should create company', async () => {
        // Data
        const data: CreateCompanyDTO = {
          name: 'test',
          document: '120431290001',
          phone: '55011999999999',
          car_parking_spaces: 5,
          motorcycle_parking_spaces: 5,
          address: {
            country: 'Brazil',
            state: 'Sao Paulo',
            city: 'Sao Paulo',
            address: 'Avenida sao jose',
            number: 150,
            zipcode: '1234512',
          },
        };

        // Mocked functions
        jest
          .spyOn(repository, 'create')
          .mockResolvedValueOnce({ id: v4(), ...data });

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
      it('should fail to update unexitent company', async () => {
        // Data
        const id = v4();
        const data: UpdateCompanyDTO = { car_parking_spaces: 10 };

        // Mocked functions
        jest.spyOn(repository, 'existsBy').mockResolvedValueOnce(undefined);

        // Execution | Audition
        expect(service.update(id, data)).rejects.toThrow('Company not found');
        expect(
          service.update(v4(), data),
        ).rejects.toThrowErrorMatchingInlineSnapshot();
        expect(repository.existsBy).toHaveBeenCalledTimes(1);
        expect(repository.existsBy).toHaveBeenCalledWith({ id });
      });
    });

    describe('successes', () => {
      it('should update a company', async () => {
        // Data
        const id = companyMock[0].id;
        const data: UpdateCompanyDTO = { car_parking_spaces: 10 };

        // Mocked functions
        jest
          .spyOn(repository, 'existsBy')
          .mockImplementationOnce(
            async (where) =>
              !!companyMock.find((company) => company.id === where?.id),
          );

        // Execution
        const sut = await service.update(id, data);

        // Audition
        expect(sut.id).toEqual(id);
        expect(sut).toMatchObject(data);
        expect(repository.findOneBy).toHaveBeenCalledTimes(1);
        expect(repository.findOneBy).toHaveBeenCalledWith({ id }, data);
      });
    });
  });

  describe('delete', () => {
    describe('exceptions', () => {
      it('should fail to delete unexistent company', () => {
        const id = v4();

        // Mocked functions
        jest.spyOn(repository, 'existsBy').mockResolvedValueOnce(undefined);

        // Execution | Audition
        expect(service.delete(id)).rejects.toThrow('Company not found');
        expect(service.delete(id)).rejects.toThrowErrorMatchingInlineSnapshot();
        expect(repository.existsBy).toHaveBeenCalledTimes(1);
        expect(repository.existsBy).toHaveBeenLastCalledWith({ id });
      });
    });

    describe('successes', () => {
      it('should delete company', async () => {
        // Data
        const id = companyMock[0].id;

        // Mocked functions
        jest
          .spyOn(repository, 'existsBy')
          .mockImplementationOnce(
            async (where) =>
              !!companyMock.find((company) => company.id === where?.id),
          );
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
    describe('successes', () => {
      it('should return company', async () => {
        // Data
        const id = companyMock[0].id;

        // Mocked functions
        jest
          .spyOn(repository, 'findOneBy')
          .mockImplementationOnce(
            async (where) =>
              companyMock.find(
                (company) => company.id === where?.id,
              ) as unknown as Company,
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

  describe('findAll', () => {
    describe('successes', () => {
      it('should find all companies', () => {});

      it('should find all companies filtered by ids', () => {});

      it('should find all companies filtered by name', () => {});

      it('should find all companies filtered by document', () => {});

      it('should find all companies filtered by phone', () => {});
    });
  });
});
