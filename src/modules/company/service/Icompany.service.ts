import { Company } from '@entities/Company.entity';

import { CreateCompanyDTO } from '../dto/create-company.dto';
import { FindManyCompaniesDTO } from '../dto/find-many-companies.dto';
import { PaginatedCompaniesDTO } from '../dto/paginated-companies.dto';
import { UpdateCompanyDTO } from '../dto/update-company.dto';

export abstract class ICompanyService {
  abstract create(data: CreateCompanyDTO): Promise<Company>;
  abstract update(id: string, data: UpdateCompanyDTO): Promise<Company>;
  abstract delete(id: string): Promise<void>;
  abstract findOneById(id: string): Promise<Company>;
  abstract findAll(
    filters: FindManyCompaniesDTO,
  ): Promise<PaginatedCompaniesDTO>;
}
