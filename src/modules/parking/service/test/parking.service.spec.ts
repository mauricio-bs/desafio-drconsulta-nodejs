import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { v4 } from 'uuid';

import { DatabaseModule } from '@database/database.module';
import { Address } from '@entities/Address.entity';
import { Company } from '@entities/Company.entity';
import { Parking } from '@entities/Parking.entity';
import { Vehicle } from '@entities/Vehicle.entity';
import { CreateParkingDTO } from '@modules/parking/dto/create-parking.dto';
import { FindManyParkingsDTO } from '@modules/parking/dto/find-many-parkings.dto';
import { UpdateParkingDTO } from '@modules/parking/dto/update-parking.dto';
import { ICompanyRepository } from '@modules/parking/repository/ICompanyRepository';
import { IParkingRepository } from '@modules/parking/repository/IParkingRepository';
import { IVehicleRepository } from '@modules/parking/repository/IVehicleRepository';

import { IParkingService } from '../Iparking.service';
import { ParkingService } from '../parking.service';
import {
  companyParkingMock,
  parkingsMock,
  vehiclesParkingMock,
} from './parking.mock';

describe('ParkingService', () => {
  let service: IParkingService;
  let parkingRepository: jest.Mocked<IParkingRepository>;
  let companyRepository: jest.Mocked<ICompanyRepository>;
  let vehicleRepository: jest.Mocked<IVehicleRepository>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([Parking, Vehicle, Company, Address]),
      ],
      providers: [
        { provide: IParkingService, useClass: ParkingService },
        {
          provide: IParkingRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
            findOneById: jest.fn(),
            findAll: jest.fn(),
            exists: jest.fn(),
            countParkings: jest.fn(),
          },
        },
        { provide: ICompanyRepository, useValue: { findOneById: jest.fn() } },
        { provide: IVehicleRepository, useValue: { findOneById: jest.fn() } },
      ],
    }).compile();

    service = module.get(IParkingService);
    parkingRepository = module.get(IParkingRepository);
    companyRepository = module.get(ICompanyRepository);
    vehicleRepository = module.get(IVehicleRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(parkingRepository).toBeDefined();
    expect(companyRepository).toBeDefined();
    expect(vehicleRepository).toBeDefined();
  });

  describe('create', () => {
    describe('exceptions', () => {
      it('should fail to create parking with unexistent vehicle', () => {
        // Data
        const data: CreateParkingDTO = {
          started_at: new Date(),
          vehicle_id: v4(),
        };

        // Mocked functions
        vehicleRepository.findOneById.mockResolvedValue(undefined);

        // Execution | Audition
        expect(service.create(data)).rejects.toThrow('Vehicle not found');
        expect(service.create(data)).rejects.toThrowErrorMatchingInlineSnapshot(
          `"Vehicle not found"`,
        );
        expect(vehicleRepository.findOneById).toHaveBeenCalledTimes(0);
        expect(companyRepository.findOneById).toHaveBeenCalledTimes(0);
        expect(parkingRepository.create).toHaveBeenCalledTimes(0);
      });

      it('should fail to create parking when does not have free car spaces', async () => {
        // Data
        const data: CreateParkingDTO = {
          started_at: new Date(),
          vehicle_id: vehiclesParkingMock[0].id,
        };

        // Mocked functions
        vehicleRepository.findOneById.mockResolvedValue(
          vehiclesParkingMock[0] as Vehicle,
        );
        companyRepository.findOneById.mockResolvedValue(
          companyParkingMock[0] as Company,
        );
        parkingRepository.countParkings.mockResolvedValue(
          companyParkingMock[0].car_parking_spaces,
        );

        // Execution | Audition
        expect(service.create(data)).rejects.toThrow(
          'All company car spaces are occupied',
        );
        expect(service.create(data)).rejects.toThrowErrorMatchingInlineSnapshot(
          `"All company car spaces are occupied"`,
        );
        expect(vehicleRepository.findOneById).toHaveBeenCalledTimes(1);
        expect(companyRepository.findOneById).toHaveBeenCalledTimes(1);
        expect(parkingRepository.create).toHaveBeenCalledTimes(0);
      });

      it('should fail to create parking when does not have free motorcycle spaces', async () => {
        // Data
        const data: CreateParkingDTO = {
          started_at: new Date(),
          vehicle_id: vehiclesParkingMock[1].id,
        };

        // Mocked functions
        vehicleRepository.findOneById.mockResolvedValue(
          vehiclesParkingMock[1] as Vehicle,
        );
        companyRepository.findOneById.mockResolvedValue(
          companyParkingMock[0] as Company,
        );
        parkingRepository.countParkings.mockResolvedValue(
          companyParkingMock[0].motorcycle_parking_spaces,
        );

        // Execution | Audition
        expect(service.create(data)).rejects.toThrow(
          'All company motorcycle spaces are occupied',
        );
        expect(service.create(data)).rejects.toThrowErrorMatchingInlineSnapshot(
          `"All company motorcycle spaces are occupied"`,
        );
        expect(vehicleRepository.findOneById).toHaveBeenCalledTimes(1);
        expect(companyRepository.findOneById).toHaveBeenCalledTimes(1);
        expect(parkingRepository.create).toHaveBeenCalledTimes(0);
      });
    });

    describe('successes', () => {
      it('should create parking for a car', async () => {
        // Data
        const data: CreateParkingDTO = {
          started_at: new Date(),
          vehicle_id: vehiclesParkingMock[0].id,
        };

        // Mocked functions
        vehicleRepository.findOneById.mockResolvedValue(
          vehiclesParkingMock[0] as Vehicle,
        );
        companyRepository.findOneById.mockResolvedValue(
          companyParkingMock[0] as Company,
        );
        parkingRepository.countParkings.mockResolvedValue(0);

        // Execution
        const sut = await service.create(data);

        // Audition
        expect(sut).toMatchObject(data);
        expect(vehicleRepository.findOneById).toHaveBeenCalledTimes(1);
        expect(companyRepository.findOneById).toHaveBeenCalledTimes(1);
        expect(parkingRepository.create).toHaveBeenCalledTimes(1);
      });

      it('should create parking for a motorcycle', async () => {
        // Data
        const data: CreateParkingDTO = {
          started_at: new Date(),
          vehicle_id: vehiclesParkingMock[1].id,
        };

        // Mocked functions
        vehicleRepository.findOneById.mockResolvedValue(
          vehiclesParkingMock[0] as Vehicle,
        );
        companyRepository.findOneById.mockResolvedValue(
          companyParkingMock[0] as Company,
        );
        parkingRepository.countParkings.mockResolvedValue(0);

        // Execution
        const sut = await service.create(data);

        // Audition
        expect(sut).toMatchObject(data);
        expect(vehicleRepository.findOneById).toHaveBeenCalledTimes(1);
        expect(companyRepository.findOneById).toHaveBeenCalledTimes(1);
        expect(parkingRepository.create).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('update', () => {
    describe('exceptions', () => {
      it('should fail to update an unexistent parking', () => {
        // Data
        const id = v4();
        const data: UpdateParkingDTO = { vehicle_id: v4() };

        // Mocked functions
        parkingRepository.exists.mockResolvedValue(false);
        vehicleRepository.findOneById.mockRejectedValue(
          new Error('Vehicle not exists'),
        );
        parkingRepository.update.mockRejectedValue(
          new Error('Parking not exists'),
        );

        // Execution | Audition
        expect(service.update(id, data)).rejects.toThrow('Parking not found');
        expect(
          service.update(id, data),
        ).rejects.toThrowErrorMatchingInlineSnapshot(`"Parking not found"`);
        expect(parkingRepository.exists).toHaveBeenCalledTimes(0);
        expect(vehicleRepository.findOneById).toHaveBeenCalledTimes(0);
        expect(parkingRepository.update).toHaveBeenCalledTimes(0);
      });

      it('should fail to update parking with unexistent vehicle', () => {
        // Data
        const id = v4();
        const data: UpdateParkingDTO = { vehicle_id: v4() };

        // Mocked functions
        parkingRepository.exists.mockResolvedValue(true);
        vehicleRepository.findOneById.mockRejectedValue(
          new Error('Vehicle not exists'),
        );
        parkingRepository.update.mockRejectedValue(
          new Error('Vehicle not exists'),
        );

        // Execution | Audition
        expect(service.update(id, data)).rejects.toThrow('Vehicle not found');
        expect(
          service.update(id, data),
        ).rejects.toThrowErrorMatchingInlineSnapshot(`"Vehicle not found"`);
        expect(parkingRepository.exists).toHaveBeenCalledTimes(0);
        expect(vehicleRepository.findOneById).toHaveBeenCalledTimes(0);
        expect(parkingRepository.update).toHaveBeenCalledTimes(0);
      });
    });

    describe('successes', () => {
      it('should update ended_at', async () => {
        // Data
        const id = parkingsMock[0].id;
        const data: UpdateParkingDTO = { ended_at: new Date() };

        // Mocked functions
        parkingRepository.exists.mockResolvedValueOnce(true);
        parkingRepository.update.mockResolvedValueOnce({
          ...parkingsMock[0],
          ...data,
        } as Parking);

        // Execution
        const sut = await service.update(id, data);

        // Audition
        expect(sut).toMatchObject(data);
        expect(parkingRepository.exists).toHaveBeenCalledTimes(1);
        expect(parkingRepository.exists).toHaveBeenCalledWith(id);
        expect(parkingRepository.update).toHaveBeenCalledTimes(1);
        expect(parkingRepository.update).toHaveBeenCalledWith(id, data);
      });

      it('should update observations', async () => {
        // Data
        const id = parkingsMock[0].id;
        const data: UpdateParkingDTO = {
          observations: 'update observation test',
        };

        // Mocked functions
        parkingRepository.exists.mockResolvedValueOnce(true);
        parkingRepository.update.mockResolvedValueOnce({
          ...parkingsMock[0],
          ...data,
        } as Parking);

        // Execution
        const sut = await service.update(id, data);

        // Audition
        expect(sut).toMatchObject(data);
        expect(parkingRepository.exists).toHaveBeenCalledTimes(1);
        expect(parkingRepository.exists).toHaveBeenCalledWith(id);
        expect(parkingRepository.update).toHaveBeenCalledTimes(1);
        expect(parkingRepository.update).toHaveBeenCalledWith(id, data);
      });

      it('should update vehicle', async () => {
        // Data
        const id = parkingsMock[0].id;
        const data: UpdateParkingDTO = { vehicle_id: v4() };

        // Mocked functions
        parkingRepository.exists.mockResolvedValueOnce(true);
        vehicleRepository.exists.mockResolvedValueOnce(true);
        parkingRepository.update.mockResolvedValueOnce({
          ...parkingsMock[0],
          ...data,
        } as Parking);

        // Execution
        const sut = await service.update(id, data);

        // Audition
        expect(sut).toMatchObject(data);
        expect(parkingRepository.exists).toHaveBeenCalledTimes(1);
        expect(parkingRepository.exists).toHaveBeenCalledWith(id);
        expect(vehicleRepository.exists).toHaveBeenCalledTimes(1);
        expect(vehicleRepository.exists).toHaveBeenCalledWith(data.vehicle_id);
        expect(parkingRepository.update).toHaveBeenCalledTimes(1);
        expect(parkingRepository.update).toHaveBeenCalledWith(id, data);
      });
    });
  });

  describe('delete', () => {
    describe('exceptions', () => {
      it('should fail to delete unexistent parking', () => {
        // Data
        const id = v4();

        // Mocked functions
        parkingRepository.exists.mockResolvedValue(false);
        parkingRepository.softDelete.mockRejectedValue(
          new Error('Parking not exists'),
        );

        // Execution | Audition
        expect(service.delete(id)).rejects.toThrow('Parking not found');
        expect(service.delete(id)).rejects.toThrowErrorMatchingInlineSnapshot(
          `"Parking not found"`,
        );
        expect(parkingRepository.exists).toHaveBeenCalledTimes(0);
        expect(parkingRepository.softDelete).toHaveBeenCalledTimes(0);
      });
    });

    describe('successes', () => {
      it('should delete parking', async () => {
        // Data
        const id = v4();

        // Mocked functions
        parkingRepository.exists.mockResolvedValue(true);
        parkingRepository.softDelete.mockResolvedValue();

        // Execution
        const sut = await service.delete(id);

        // Audition
        expect(sut).toBeUndefined();
        expect(parkingRepository.exists).toHaveBeenCalledTimes(1);
        expect(parkingRepository.exists).toHaveBeenCalledWith(id);
        expect(parkingRepository.softDelete).toHaveBeenCalledTimes(1);
        expect(parkingRepository.softDelete).toHaveBeenCalledWith(id);
      });
    });
  });

  describe('findOneById', () => {
    describe('exceptions', () => {
      it('should fail to return an parking by unexistent id', async () => {
        // Data
        const id = v4();

        // Mocked functions
        parkingRepository.findOneById.mockResolvedValue(undefined);

        // Execution | Audition
        expect(service.findOneById(id)).rejects.toThrow('Parking not found');
        expect(
          service.findOneById(id),
        ).rejects.toThrowErrorMatchingInlineSnapshot(`"Parking not found"`);
        expect(parkingRepository.findOneById).toHaveBeenCalledTimes(1);
      });
    });

    describe('successes', () => {
      it('should find parking by id', async () => {
        // Data
        const id = parkingsMock[0].id;

        // Mocked functions
        parkingRepository.findOneById.mockResolvedValueOnce(
          parkingsMock[0] as Parking,
        );

        // Execution
        const sut = await service.findOneById(id);

        // Audition
        expect(sut).toHaveProperty('id', id);
        expect(parkingRepository.findOneById).toHaveBeenCalledTimes(1);
        expect(parkingRepository.findOneById).toHaveBeenCalledWith(id);
      });
    });
  });

  describe('findAll', () => {
    describe('exceptions', () => {
      it('should fail to find parkings only with start date', async () => {
        // Data
        const filters: FindManyParkingsDTO = {
          page: 1,
          limit: 10,
          started_at: new Date('2024-1-10'),
        };

        // Execution | Audition
        expect(service.findAll(filters)).rejects.toThrow(
          'Must have started and ended date to filter data',
        );
        expect(
          service.findAll(filters),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `"Must have started and ended date to filter data"`,
        );
        expect(parkingRepository.findAll).toHaveBeenCalledTimes(0);
      });

      it('should fail to find parkings only with end date', async () => {
        // Data
        const filters: FindManyParkingsDTO = {
          page: 1,
          limit: 10,
          ended_at: new Date('2024-1-10'),
        };

        // Execution | Audition
        expect(service.findAll(filters)).rejects.toThrow(
          'Must have started and ended date to filter data',
        );
        expect(
          service.findAll(filters),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `"Must have started and ended date to filter data"`,
        );
        expect(parkingRepository.findAll).toHaveBeenCalledTimes(0);
      });

      it('should fail to find parkings with start date greater than end date', async () => {
        // Data
        const filters: FindManyParkingsDTO = {
          page: 1,
          limit: 10,
          started_at: new Date('2024-1-10'),
          ended_at: new Date('2024-1-09'),
        };

        // Execution | Audition
        expect(service.findAll(filters)).rejects.toThrow(
          'start date can not be after end date',
        );
        expect(
          service.findAll(filters),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          `"start date can not be after end date"`,
        );
        expect(parkingRepository.findAll).toHaveBeenCalledTimes(0);
      });
    });

    describe('successes', () => {
      it('should find all parkings', async () => {
        // Data
        const filters: FindManyParkingsDTO = { page: 1, limit: 10 };

        // Mocked functions
        parkingRepository.findAll.mockResolvedValueOnce({
          total: parkingsMock.length,
          data: parkingsMock as Parking[],
        });

        // Execution
        const sut = await service.findAll(filters);

        // Audition
        expect(sut).toHaveProperty('total');
        expect(sut.total).toBeGreaterThan(0);
        expect(sut).toHaveProperty('data');
        expect(typeof sut.data).toBe('object');
        expect(sut.data.length).toBeGreaterThan(0);
        expect(sut.data.length).toBeLessThanOrEqual(filters.limit);
        expect(parkingRepository.findAll).toHaveBeenCalledTimes(1);
        expect(parkingRepository.findAll).toHaveBeenCalledWith(filters);
      });

      it('should find parkings filtered by vehicle', async () => {
        // Data
        const filters: FindManyParkingsDTO = {
          page: 1,
          limit: 10,
          vehicle_id: parkingsMock[0].vehicle.id,
        };

        // Mocked functions
        parkingRepository.findAll.mockResolvedValueOnce({
          total: parkingsMock.length,
          data: [parkingsMock[0]] as Parking[],
        });

        // Execution
        const sut = await service.findAll(filters);

        // Audition
        expect(sut).toHaveProperty('total');
        expect(sut.total).toBeGreaterThan(0);
        expect(sut).toHaveProperty('data');
        expect(typeof sut.data).toBe('object');
        expect(sut.data.length).toBeGreaterThan(0);
        expect(sut.data.length).toBeLessThanOrEqual(filters.limit);
        expect(parkingRepository.findAll).toHaveBeenCalledTimes(1);
        expect(parkingRepository.findAll).toHaveBeenCalledWith(filters);
      });

      it('should find parkings filtered by company', async () => {
        // Data
        const filters: FindManyParkingsDTO = {
          page: 1,
          limit: 10,
          company_id: v4(),
        };

        // Mocked functions
        parkingRepository.findAll.mockResolvedValueOnce({
          total: parkingsMock.length,
          data: [parkingsMock[0], parkingsMock[1]] as Parking[],
        });

        // Execution
        const sut = await service.findAll(filters);

        // Audition
        expect(sut).toHaveProperty('total');
        expect(sut.total).toBeGreaterThan(0);
        expect(sut).toHaveProperty('data');
        expect(typeof sut.data).toBe('object');
        expect(sut.data.length).toBeGreaterThan(0);
        expect(sut.data.length).toBeLessThanOrEqual(filters.limit);
        expect(parkingRepository.findAll).toHaveBeenCalledTimes(1);
        expect(parkingRepository.findAll).toHaveBeenCalledWith(filters);
      });
    });
  });
});
