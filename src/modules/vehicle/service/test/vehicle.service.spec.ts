import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { v4 } from 'uuid';

import { DatabaseModule } from '@database/database.module';
import { Address } from '@entities/Address.entity';
import { Company } from '@entities/Company.entity';
import { Parking } from '@entities/Parking.entity';
import { Vehicle } from '@entities/Vehicle.entity';
import { EVehicleType } from '@enum/EVehicleType';
import { CreateVehicleDTO } from '@modules/vehicle/dto/create-vehicle.dto';
import { FindManyVehiclesDTO } from '@modules/vehicle/dto/find-many-vehicles.dto';
import { UpdateVehicleDTO } from '@modules/vehicle/dto/update-vehicle.dto';
import { ICompanyRepository } from '@modules/vehicle/repository/ICompanyRepository';
import { IVehicleRepository } from '@modules/vehicle/repository/IVehicleRepository';

import { IVehicleService } from '../Ivehicle.service';
import { VehicleService } from '../vehicle.service';
import { findAllMocked, vehiclesMock } from './vehicleMock';

describe('VehicleService', () => {
  let service: IVehicleService;
  let vehicleRepository: jest.Mocked<IVehicleRepository>;
  let companyRepository: jest.Mocked<ICompanyRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([Vehicle, Parking, Company, Address]),
      ],
      providers: [
        ConfigService,
        { provide: IVehicleService, useClass: VehicleService },
        {
          provide: IVehicleRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
            findOneById: jest.fn(),
            findAll: jest.fn(),
            exists: jest.fn(),
          },
        },
        { provide: ICompanyRepository, useValue: { exists: jest.fn() } },
      ],
    }).compile();

    service = module.get(IVehicleService);
    vehicleRepository = module.get(IVehicleRepository);
    companyRepository = module.get(ICompanyRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(vehicleRepository).toBeDefined();
    expect(companyRepository).toBeDefined();
  });

  describe('create', () => {
    describe('exceptions', () => {
      it('should fail to create vehicle for unexistent company', async () => {
        // Data
        const data: CreateVehicleDTO = {
          brand: 'mitsubishi',
          color: 'white',
          company_id: v4(),
          licence_plate: 'FFF1A99',
          type: EVehicleType.car,
        };

        // Mocked functions
        companyRepository.exists.mockResolvedValue(false);
        vehicleRepository.create.mockRejectedValue(
          new Error('Company not  exists'),
        );

        // Execution | Audition
        expect(service.create(data)).rejects.toThrow('Company not found');
        expect(service.create(data)).rejects.toThrowErrorMatchingInlineSnapshot(
          `"Company not found"`,
        );
        expect(companyRepository.exists).toHaveBeenCalledTimes(0);
        expect(vehicleRepository.create).toHaveBeenCalledTimes(0);
      });
    });

    describe('successes', () => {
      it('should create vehicle', async () => {
        // Data
        const data: CreateVehicleDTO = {
          brand: 'mitsubishi',
          color: 'white',
          company_id: v4(),
          licence_plate: 'FFF1A99',
          type: EVehicleType.car,
        };

        // Mocked functions
        companyRepository.exists.mockResolvedValueOnce(true);
        vehicleRepository.create.mockResolvedValueOnce({
          id: v4(),
          ...data,
          created_at: new Date(),
          updated_at: new Date(),
        } as unknown as Vehicle);

        // Execution
        const sut = await service.create(data);

        // Audition
        expect(sut).toMatchObject(data);
        expect(companyRepository.exists).toHaveBeenCalledTimes(1);
        expect(companyRepository.exists).toHaveBeenCalledWith(data.company_id);
        expect(vehicleRepository.create).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.create).toHaveBeenCalledWith(data);
      });
    });
  });

  describe('update', () => {
    describe('exceptions', () => {
      it('should to update unexistent vehicle', () => {
        // Data
        const id = v4();
        const data: UpdateVehicleDTO = {
          brand: 'mitsubishi',
          color: 'white',
          company_id: v4(),
          licence_plate: 'FFF1A99',
          type: EVehicleType.car,
        };

        // Mocked functions
        vehicleRepository.exists.mockResolvedValue(false);
        vehicleRepository.update.mockRejectedValue(
          new Error('Vehicle not exists'),
        );

        // Execution | Audition
        expect(service.update(id, data)).rejects.toThrow('Vehicle not found');
        expect(
          service.update(id, data),
        ).rejects.toThrowErrorMatchingInlineSnapshot(`"Vehicle not found"`);
        expect(vehicleRepository.exists).toHaveBeenCalledTimes(0);
        expect(vehicleRepository.update).toHaveBeenCalledTimes(0);
      });

      it('should to update vehicle linkning with unexistent company', () => {
        // Data
        const id = v4();
        const data: UpdateVehicleDTO = {
          company_id: v4(),
          licence_plate: 'FFF1A99',
        };

        // Mocked functions
        vehicleRepository.exists.mockResolvedValue(true);
        companyRepository.exists.mockResolvedValue(false);
        vehicleRepository.update.mockRejectedValue(
          new Error('Vehicle not exists'),
        );

        // Execution | Audition
        expect(service.update(id, data)).rejects.toThrow('Company not found');
        expect(
          service.update(id, data),
        ).rejects.toThrowErrorMatchingInlineSnapshot();
        expect(vehicleRepository.exists).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.exists).toHaveBeenCalledWith(id);
        expect(companyRepository.exists).toHaveBeenCalledTimes(1);
        expect(companyRepository.exists).toHaveBeenCalledWith(data.company_id);
        expect(vehicleRepository.update).toHaveBeenCalledTimes(0);
      });
    });

    describe('successes', () => {
      it('should update vehicle color', async () => {
        // Data
        const id = vehiclesMock[0].id;
        const data: UpdateVehicleDTO = { color: 'black' };

        // Mocked functions
        companyRepository.exists.mockResolvedValueOnce(true);
        vehicleRepository.exists.mockResolvedValueOnce(true);
        vehicleRepository.update.mockResolvedValueOnce({
          id: v4(),
          ...data,
          created_at: new Date(),
          updated_at: new Date(),
        } as unknown as Vehicle);

        // Execution
        const sut = await service.update(id, data);

        // Audition
        expect(sut).toHaveProperty('id', id);
        expect(sut).toHaveProperty('color', data.color);
        expect(vehicleRepository.exists).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.exists).toHaveBeenCalledWith(id);
        expect(companyRepository.exists).toHaveBeenCalledTimes(0);
        expect(vehicleRepository.update).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.update).toHaveBeenCalledWith(id, data);
      });

      it('should update vehicle brand', async () => {
        // Data
        const id = vehiclesMock[0].id;
        const data: UpdateVehicleDTO = { brand: 'hyundai' };

        // Mocked functions
        companyRepository.exists.mockResolvedValueOnce(true);
        vehicleRepository.exists.mockResolvedValueOnce(true);
        vehicleRepository.update.mockResolvedValueOnce({
          id: v4(),
          ...data,
          created_at: new Date(),
          updated_at: new Date(),
        } as unknown as Vehicle);

        // Execution
        const sut = await service.update(id, data);

        // Audition
        expect(sut).toHaveProperty('id', id);
        expect(sut).toHaveProperty('brand', data.brand);
        expect(vehicleRepository.exists).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.exists).toHaveBeenCalledWith(id);
        expect(companyRepository.exists).toHaveBeenCalledTimes(0);
        expect(vehicleRepository.update).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.update).toHaveBeenCalledWith(id, data);
      });

      it('should update vehicle licence_plate', async () => {
        // Data
        const id = vehiclesMock[0].id;
        const data: UpdateVehicleDTO = { licence_plate: 'AAA1B22' };

        // Mocked functions
        companyRepository.exists.mockResolvedValueOnce(true);
        vehicleRepository.exists.mockResolvedValueOnce(true);
        vehicleRepository.update.mockResolvedValueOnce({
          id: v4(),
          ...data,
          created_at: new Date(),
          updated_at: new Date(),
        } as unknown as Vehicle);

        // Execution
        const sut = await service.update(id, data);

        // Audition
        expect(sut).toHaveProperty('id', id);
        expect(sut).toHaveProperty('licence_plate', data.licence_plate);
        expect(vehicleRepository.exists).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.exists).toHaveBeenCalledWith(id);
        expect(companyRepository.exists).toHaveBeenCalledTimes(0);
        expect(vehicleRepository.update).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.update).toHaveBeenCalledWith(id, data);
      });

      it('should update vehicle type', async () => {
        // Data
        const id = vehiclesMock[0].id;
        const data: UpdateVehicleDTO = { type: EVehicleType.motorcycle };

        // Mocked functions
        companyRepository.exists.mockResolvedValueOnce(true);
        vehicleRepository.exists.mockResolvedValueOnce(true);
        vehicleRepository.update.mockResolvedValueOnce({
          id: v4(),
          ...data,
          created_at: new Date(),
          updated_at: new Date(),
        } as unknown as Vehicle);

        // Execution
        const sut = await service.update(id, data);

        // Audition
        expect(sut).toHaveProperty('id', id);
        expect(sut).toHaveProperty('type', data.type);
        expect(vehicleRepository.exists).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.exists).toHaveBeenCalledWith(id);
        expect(companyRepository.exists).toHaveBeenCalledTimes(0);
        expect(vehicleRepository.update).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.update).toHaveBeenCalledWith(id, data);
      });

      it('should update vehicle company', async () => {
        // Data
        const id = vehiclesMock[0].id;
        const data: UpdateVehicleDTO = { company_id: v4() };

        // Mocked functions
        companyRepository.exists.mockResolvedValueOnce(true);
        vehicleRepository.exists.mockResolvedValueOnce(true);
        vehicleRepository.update.mockResolvedValueOnce({
          id: v4(),
          ...data,
          created_at: new Date(),
          updated_at: new Date(),
        } as unknown as Vehicle);

        // Execution
        const sut = await service.update(id, data);

        // Audition
        expect(sut).toHaveProperty('id', id);
        expect(sut).toHaveProperty('company_id', data.company_id);
        expect(vehicleRepository.exists).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.exists).toHaveBeenCalledWith(id);
        expect(companyRepository.exists).toHaveBeenCalledTimes(1);
        expect(companyRepository.exists).toHaveBeenCalledWith(data.company_id);
        expect(vehicleRepository.update).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.update).toHaveBeenCalledWith(id, data);
      });
    });
  });

  describe('delete', () => {
    describe('exceptions', () => {
      it('should fail to delete an unexistent vehicle', () => {
        // Data
        const id = v4();

        // Mocked functions
        vehicleRepository.exists.mockResolvedValue(false);
        vehicleRepository.softDelete.mockResolvedValue();

        // Execution | Audition
        expect(service.delete(id)).rejects.toThrow('Vehicle not found');
        expect(service.delete(id)).rejects.toThrowErrorMatchingInlineSnapshot(
          `"Vehicle not found"`,
        );
        expect(vehicleRepository.exists).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.exists).toHaveBeenCalledWith(id);
        expect(vehicleRepository.softDelete).toHaveBeenCalledTimes(0);
      });
    });

    describe('successes', () => {
      it('should delete vehicle', async () => {
        // Data
        const id = vehiclesMock[0].id;

        // Mocked functions
        vehicleRepository.exists.mockResolvedValueOnce(true);
        vehicleRepository.softDelete.mockResolvedValueOnce();

        // Execution
        const sut = await service.delete(id);

        // Audition
        expect(sut).toBeUndefined();
        expect(vehicleRepository.exists).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.exists).toHaveBeenCalledWith(id);
        expect(vehicleRepository.softDelete).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.softDelete).toHaveBeenCalledWith(id);
      });
    });
  });

  describe('findOneById', () => {
    describe('exceptions', () => {
      it('should fail to return an unexistent vehicle by id', async () => {
        // Data
        const id = v4();

        // Mocked functions
        vehicleRepository.findOneById.mockResolvedValue(undefined);

        // Execution | Audition
        expect(service.findOneById(id)).rejects.toThrow('Vehicle not found');
        expect(
          service.findOneById(id),
        ).rejects.toThrowErrorMatchingInlineSnapshot(`"Vehicle not found"`);
        expect(vehicleRepository.findOneById).toHaveBeenCalledTimes(0);
      });
    });

    describe('successes', () => {
      it('should return vehicle by id', async () => {
        // Data
        const id = vehiclesMock[0].id;

        // Mocked functions
        vehicleRepository.findOneById.mockResolvedValue(
          vehiclesMock[0] as Vehicle,
        );

        // Execution
        const sut = await service.findOneById(id);

        // Audition
        expect(sut).not.toBeUndefined();
        expect(sut).toHaveProperty('id', id);
        expect(vehicleRepository.findOneById).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.findOneById).toHaveBeenCalledWith(id);
      });
    });
  });

  describe('findAll', () => {
    describe('successes', () => {
      it('should find all vehicles', async () => {
        // Data
        const filters: FindManyVehiclesDTO = {
          page: 1,
          limit: 10,
        };

        // Mocked functions
        vehicleRepository.findAll.mockImplementationOnce(async (filters) =>
          findAllMocked(filters),
        );

        // Execution
        const sut = await service.findAll(filters);

        // Audition
        expect(sut).toHaveProperty('total');
        expect(sut).toHaveProperty('data');
        expect(sut.total).toBeGreaterThan(0);
        expect(typeof sut.data).toBe('object');
        expect(sut.data.length).toBeGreaterThan(0);
        expect(sut.data.length).toBeLessThanOrEqual(filters.limit);
      });

      it('should return an empty array when any vehicles match filters', async () => {
        // Data
        const filters: FindManyVehiclesDTO = {
          id: [v4()],
          page: 1,
          limit: 10,
        };

        // Mocked functions
        vehicleRepository.findAll.mockImplementationOnce(async (filters) =>
          findAllMocked(filters),
        );

        // Execution
        const sut = await service.findAll(filters);

        // Audition
        expect(sut).toHaveProperty('total', 0);
        expect(sut).toHaveProperty('data');
        expect(typeof sut.data).toBe('object');
        expect(sut.data.length).toBe(0);
      });

      it('should return vehicles filtered by id', async () => {
        // Data
        const filters: FindManyVehiclesDTO = {
          id: [vehiclesMock[0].id],
          page: 1,
          limit: 10,
        };

        // Mocked functions
        vehicleRepository.findAll.mockImplementationOnce(async (filters) =>
          findAllMocked(filters),
        );

        // Execution
        const sut = await service.findAll(filters);

        const wrong_sut = sut.data.filter(
          (data) => !filters.id.includes(data.id),
        );

        // Audition
        expect(sut).toHaveProperty('total');
        expect(sut).toHaveProperty('data');
        expect(sut.total).toBeGreaterThan(0);
        expect(typeof sut.data).toBe('object');
        expect(sut.data.length).toBeGreaterThan(0);
        expect(sut.data.length).toBeLessThanOrEqual(filters.limit);
        expect(wrong_sut.length).toBe(0);
      });

      it('should return vehicles filtered by type', async () => {
        // Data
        const filters: FindManyVehiclesDTO = {
          type: EVehicleType.motorcycle,
          page: 1,
          limit: 10,
        };

        // Mocked functions
        vehicleRepository.findAll.mockImplementationOnce(async (filters) =>
          findAllMocked(filters),
        );

        // Execution
        const sut = await service.findAll(filters);

        const wrong_sut = sut.data.filter((data) => data.type === filters.type);

        // Audition
        expect(sut).toHaveProperty('total');
        expect(sut).toHaveProperty('data');
        expect(sut.total).toBeGreaterThan(0);
        expect(typeof sut.data).toBe('object');
        expect(sut.data.length).toBeGreaterThan(0);
        expect(sut.data.length).toBeLessThanOrEqual(filters.limit);
        expect(wrong_sut.length).toBe(0);
      });

      it('should return vehicles filtered by partial brand', async () => {
        // Data
        const filters: FindManyVehiclesDTO = {
          brand: 'chev',
          page: 1,
          limit: 10,
        };

        // Mocked functions
        vehicleRepository.findAll.mockImplementationOnce(async (filters) =>
          findAllMocked(filters),
        );

        // Execution
        const sut = await service.findAll(filters);

        const wrong_sut = sut.data.filter(
          (data) => !data.brand.includes(filters.brand),
        );

        // Audition
        expect(sut).toHaveProperty('total');
        expect(sut).toHaveProperty('data');
        expect(sut.total).toBeGreaterThan(0);
        expect(typeof sut.data).toBe('object');
        expect(sut.data.length).toBeGreaterThan(0);
        expect(sut.data.length).toBeLessThanOrEqual(filters.limit);
        expect(wrong_sut.length).toBe(0);
      });

      it('should return vehicles filtered by partial license plate', async () => {
        // Data
        const filters: FindManyVehiclesDTO = {
          license_plate: '1A99',
          page: 1,
          limit: 10,
        };

        // Mocked functions
        vehicleRepository.findAll.mockImplementationOnce(async (filters) =>
          findAllMocked(filters),
        );

        // Execution
        const sut = await service.findAll(filters);

        const wrong_sut = sut.data.filter(
          (data) => !data.licence_plate.includes(filters.license_plate),
        );

        // Audition
        expect(sut).toHaveProperty('total');
        expect(sut).toHaveProperty('data');
        expect(sut.total).toBeGreaterThan(0);
        expect(typeof sut.data).toBe('object');
        expect(sut.data.length).toBeGreaterThan(0);
        expect(sut.data.length).toBeLessThanOrEqual(filters.limit);
        expect(wrong_sut.length).toBe(0);
      });
    });
  });
});
