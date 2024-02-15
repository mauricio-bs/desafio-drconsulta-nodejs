import { NotFoundException } from '@nestjs/common';

import { Company } from '@entities/Company.entity';

import { CreateCompanyDTO } from '../dto/create-company.dto';
import { FindManyCompaniesDTO } from '../dto/find-many-companies.dto';
import { PaginatedCompaniesDTO } from '../dto/paginated-companies.dto';
import { UpdateCompanyDTO } from '../dto/update-company.dto';
import { ICompanyRepository } from '../repository/ICompanyRepository';
import { ICompanyService } from './Icompany.service';

export class CompanyService implements ICompanyService {
  constructor(private repository: ICompanyRepository) {}

  async create(data: CreateCompanyDTO): Promise<Company> {
    return this.repository.create(data);
  }

  async update(id: string, data: UpdateCompanyDTO): Promise<Company> {
    if (!(await this.repository.existById(id)))
      throw new NotFoundException('Company not found');

    return await this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    if (!(await this.repository.existById(id)))
      throw new NotFoundException('Company not found');

    await this.repository.softDelete(id);
  }

  async findOneById(id: string): Promise<Company> {
    return await this.repository.findOneById(id);
  }

  async findAll(filters: FindManyCompaniesDTO): Promise<PaginatedCompaniesDTO> {
    return await this.repository.findAll(filters);
  }
}
