/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { v4 } from 'uuid';

import { DatabaseModule } from '@database/database.module';
import { Address } from '@entities/Address.entity';
import { Company } from '@entities/Company.entity';
import { Parking } from '@entities/Parking.entity';
import { Vehicle } from '@entities/Vehicle.entity';
import { CreateCompanyDTO } from '@modules/company/dto/create-company.dto';
import { UpdateCompanyDTO } from '@modules/company/dto/update-company.dto';
import { ICompanyRepository } from '@modules/company/repository/ICompanyRepository';

import { CompanyService } from '../company.service';
import { ICompanyService } from '../Icompany.service';
import { companyMock } from './company.mock';

describe('Company service', () => {
  let service: ICompanyService;
  let repository: jest.Mocked<ICompanyRepository>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        TypeOrmModule.forFeature([Company, Address, Vehicle, Parking]),
      ],
      providers: [
        ConfigService,
        { provide: ICompanyService, useClass: CompanyService },
        {
          provide: ICompanyRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            existById: jest.fn(),
            findOneById: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ICompanyService);
    repository = module.get(ICompanyRepository);
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
        repository.create.mockResolvedValueOnce({
          id: v4(),
          ...data,
          created_at: new Date(),
          updated_at: new Date(),
        } as Company);

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
        repository.existById.mockResolvedValueOnce(undefined);

        // Execution | Audition
        expect(service.update(id, data)).rejects.toThrow('Company not found');
        expect(
          service.update(v4(), data),
        ).rejects.toThrowErrorMatchingInlineSnapshot();
        expect(repository.existById).toHaveBeenCalledTimes(1);
        expect(repository.existById).toHaveBeenCalledWith({ id });
      });
    });

    describe('successes', () => {
      it('should update a company', async () => {
        // Data
        const id = companyMock[0].id;
        const data: UpdateCompanyDTO = { car_parking_spaces: 10 };

        // Mocked functions
        repository.existById.mockImplementationOnce(
          async (id) => !!companyMock.find((company) => company.id === id),
        );
        repository.update.mockResolvedValueOnce({
          ...companyMock[0],
          ...data,
        } as Company);

        // Execution
        const sut = await service.update(id, data);

        // Audition
        expect(sut.id).toEqual(id);
        expect(sut).toMatchObject(data);
        expect(repository.existById).toHaveBeenCalledTimes(1);
        expect(repository.existById).toHaveBeenCalledWith(id);
        expect(repository.findOneById).toHaveBeenCalledTimes(1);
        expect(repository.findOneById).toHaveBeenCalledWith(id, data);
      });
    });
  });

  describe('delete', () => {
    describe('exceptions', () => {
      it('should fail to delete unexistent company', () => {
        const id = v4();

        // Mocked functions
        repository.existById.mockResolvedValueOnce(undefined);

        // Execution | Audition
        expect(service.delete(id)).rejects.toThrow('Company not found');
        expect(service.delete(id)).rejects.toThrowErrorMatchingInlineSnapshot();
        expect(repository.existById).toHaveBeenCalledTimes(1);
        expect(repository.existById).toHaveBeenLastCalledWith(id);
      });
    });

    describe('successes', () => {
      it('should delete company', async () => {
        // Data
        const id = companyMock[0].id;

        // Mocked functions
        repository.existById.mockImplementationOnce(
          async (id) => !!companyMock.find((company) => company.id === id),
        );
        repository.softDelete.mockResolvedValueOnce(companyMock[0] as Company);

        // Execution
        const sut = await service.delete(id);

        // Audition
        expect(sut).toBeUndefined();
        expect(repository.existById).toHaveBeenCalledTimes(1);
        expect(repository.existById).toHaveBeenCalledWith(id);
        expect(repository.softDelete).toHaveBeenCalledTimes(1);
        expect(repository.softDelete).toHaveBeenCalledWith(id);
      });
    });
  });

  describe('findOneById', () => {
    describe('successes', () => {
      it('should return company', async () => {
        // Data
        const id = companyMock[0].id;

        // Mocked functions
        repository.findOneById.mockImplementationOnce(
          async (id) =>
            companyMock.find(
              (company) => company.id === id,
            ) as unknown as Company,
        );

        // Execution
        const sut = await service.findOneById(id);

        // Audition
        expect(sut).toHaveProperty('id', id);
        expect(repository.findOneById).toHaveBeenCalledTimes(1);
        expect(repository.findOneById).toHaveBeenCalledWith(id);
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
