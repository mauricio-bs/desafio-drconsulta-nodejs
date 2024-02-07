import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '@entities/Company';

import { CompanyService } from '../company.service';
import { ICompanyService } from '../Icompany.service';

describe('Company service', () => {
  let service: ICompanyService;
  let repository: Repository<Company>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Company])],
      providers: [
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
    describe('exceptions', () => {
      it('should fail if company not exists', () => {});
    });

    describe('successes', () => {
      it('should pass', () => {});
    });
  });

  describe('update', () => {
    describe('exceptions', () => {
      it('should throw error', () => {});
    });

    describe('successes', () => {
      it('should pass', () => {});
    });
  });

  describe('delete', () => {
    describe('exceptions', () => {
      it('should throw error', () => {});
    });

    describe('successes', () => {
      it('should pass', () => {});
    });
  });

  describe('findOneById', () => {
    describe('exceptions', () => {
      it('should throw error', () => {});
    });

    describe('successes', () => {
      it('should pass', () => {});
    });
  });

  describe('findAll', () => {
    describe('exceptions', () => {
      it('should throw error', () => {});
    });

    describe('successes', () => {
      it('should pass', () => {});
    });
  });
});
