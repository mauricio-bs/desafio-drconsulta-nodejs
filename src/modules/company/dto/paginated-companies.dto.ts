import { Company } from '@entities/Company';

export class PaginatedCompaniesDTO {
  total: number;

  data: Company[];
}
