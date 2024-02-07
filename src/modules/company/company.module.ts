import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/Company';

import { Address } from '@entities/Address';

import { CompanyController } from './controller/company.controller';
import { CompanyService } from './service/company.service';
import { ICompanyService } from './service/Icompany.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Address])],
  controllers: [CompanyController],
  providers: [{ provide: ICompanyService, useClass: CompanyService }],
})
export class CompanyModule {}
