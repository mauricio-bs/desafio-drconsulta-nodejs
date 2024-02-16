export abstract class ICompanyRepository {
  abstract exists(id: string): Promise<boolean>;
}
