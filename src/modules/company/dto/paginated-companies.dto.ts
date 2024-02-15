import { Company } from '@entities/Company.entity';

export class PaginatedCompaniesDTO {
  total: number;

  data: Company[];
}
