import { Company } from '@/domain/users/enterprise/entities/company'

export abstract class CompanyRepository {
  abstract create(company: Company): Promise<void>
  abstract findById(id: string): Promise<Company | null>
  abstract findByCnpj(cnpj: string): Promise<Company | null>
}
