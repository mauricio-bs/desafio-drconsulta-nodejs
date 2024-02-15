import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '@entities/Company.entity';
import { CreateCompanyDTO } from '@modules/company/dto/create-company.dto';
import { FindManyCompaniesDTO } from '@modules/company/dto/find-many-companies.dto';
import { PaginatedCompaniesDTO } from '@modules/company/dto/paginated-companies.dto';
import { UpdateCompanyDTO } from '@modules/company/dto/update-company.dto';

import { ICompanyRepository } from '../ICompanyRepository';

export class CompanyRepository implements ICompanyRepository {
  constructor(
    @InjectRepository(Company)
    private repository: Repository<Company>,
  ) {}

  async create(data: CreateCompanyDTO): Promise<Company> {
    return this.repository.create(data);
  }

  async update(id: string, data: UpdateCompanyDTO): Promise<Company> {
    return (await this.repository.update({ id }, data)) as unknown as Company;
  }

  async existById(id: string): Promise<boolean> {
    return await this.repository.existsBy({ id });
  }

  async softDelete(id: string): Promise<Company> {
    return (await this.repository.softDelete({ id })) as unknown as Company;
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
