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
    return this.repository.create(data);
  }

  async update(id: string, data: UpdateCompanyDTO): Promise<Company> {
    if (!(await this.repository.existsBy({ id })))
      throw new NotFoundException('Company not found');

    return (await this.repository.update({ id }, data)) as unknown as Company;
  }

  async delete(id: string): Promise<void> {
    if (!(await this.repository.existsBy({ id })))
      throw new NotFoundException('Company not found');

    await this.repository.softDelete({ id });
  }

  async findOneById(id: string): Promise<Company> {
    return await this.repository.findOneBy({ id });
  }

  async findAll(filters: FindManyCompaniesDTO): Promise<PaginatedCompaniesDTO> {
    let query = this.repository
      .createQueryBuilder('company')
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit);

    if (filters.id.length)
      query = query.andWhere('company.id IN (:...ids)', { ids: filters.id });

    if (filters.name) {
      query = query.andWhere('company.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    if (filters.document) {
      query = query.andWhere('company.document ILIKE :document', {
        document: `%${filters.document}%`,
      });
    }

    if (filters.phone) {
      query = query.andWhere('company.phone ILIKE :phone', {
        phone: `%${filters.phone}%`,
      });
    }

    const [data, total] = await query.getManyAndCount();

    return { total, data };
  }
}
