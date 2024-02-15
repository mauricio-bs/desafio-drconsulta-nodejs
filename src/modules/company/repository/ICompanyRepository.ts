import { Company } from '@entities/Company.entity';

import { CreateCompanyDTO } from '../dto/create-company.dto';
import { FindManyCompaniesDTO } from '../dto/find-many-companies.dto';
import { PaginatedCompaniesDTO } from '../dto/paginated-companies.dto';
import { UpdateCompanyDTO } from '../dto/update-company.dto';

export abstract class ICompanyRepository {
  abstract create(data: CreateCompanyDTO): Promise<Company>;
  abstract update(id: string, data: UpdateCompanyDTO): Promise<Company>;
  abstract existById(id: string): Promise<boolean>;
  abstract softDelete(id: string): Promise<Company>;
  abstract findOneById(id: string): Promise<Company>;
  abstract findAll(
    filters: FindManyCompaniesDTO,
  ): Promise<PaginatedCompaniesDTO>;
}
