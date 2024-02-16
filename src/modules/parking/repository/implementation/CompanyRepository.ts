import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '@entities/Company.entity';

import { ICompanyRepository } from '../ICompanyRepository';

export class CompanyRepository implements ICompanyRepository {
  constructor(
    @InjectRepository(Company) private repository: Repository<Company>,
  ) {}

  async findOneById(id: string): Promise<Company> {
    return await this.repository.findOneBy({ id });
  }
}
