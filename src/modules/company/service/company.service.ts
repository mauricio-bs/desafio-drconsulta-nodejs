import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '@entities/Company';

import { CreateCompanyDTO } from '../dto/create-company.dto';
import { FindManyCompaniesDTO } from '../dto/find-many-companies.dto';
import { PaginatedCompaniesDTO } from '../dto/paginated-companies.dto';
import { UpdateCompanyDTO } from '../dto/update-company.dto';
import { ICompanyService } from './Icompany.service';

export class CompanyService implements ICompanyService {
  constructor(
    @InjectRepository(Company)
    private repository: Repository<Company>,
  ) {}

  async create(data: CreateCompanyDTO): Promise<Company> {
    return this.repository.create(data)[0];
  }

  async update(id: string, data: UpdateCompanyDTO): Promise<Company> {
    const company = this.repository.findOneBy({ id });
    if (!company) throw new NotFoundException('Company not found');

    return (await this.repository.update({ id }, data)) as unknown as Company;
  }

  async delete(id: string): Promise<void> {
    const company = this.repository.findOneBy({ id });
    if (!company) throw new NotFoundException('Company not found');

    await this.repository.softDelete({ id });
  }

  async findOneById(id: string): Promise<Company> {
    return await this.repository.findOneBy({ id });
  }

  async findAll(filters: FindManyCompaniesDTO): Promise<PaginatedCompaniesDTO> {
    throw new Error('Method not implemented.');
  }
}
