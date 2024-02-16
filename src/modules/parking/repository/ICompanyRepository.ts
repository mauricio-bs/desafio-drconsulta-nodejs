import { Company } from '@entities/Company.entity';

export abstract class ICompanyRepository {
  abstract findOneById(id: string): Promise<Company>;
}
