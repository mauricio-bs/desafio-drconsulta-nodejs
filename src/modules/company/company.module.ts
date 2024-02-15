import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Address } from '@entities/Address.entity';
import { Company } from '@entities/Company.entity';

import { CompanyController } from './controller/company.controller';
import { ICompanyRepository } from './repository/ICompanyRepository';
import { CompanyRepository } from './repository/implementation/CompanyRepository';
import { CompanyService } from './service/company.service';
import { ICompanyService } from './service/Icompany.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Address])],
  controllers: [CompanyController],
  providers: [
    { provide: ICompanyService, useClass: CompanyService },
    { provide: ICompanyRepository, useClass: CompanyRepository },
  ],
})
export class CompanyModule {}
