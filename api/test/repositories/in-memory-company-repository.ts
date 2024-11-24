import { CompanyRepository } from '@/domain/users/application/repositories/company-repository'
import { Company } from '@/domain/users/enterprise/entities/company'

export class InMemoryCompanyRepository implements CompanyRepository {
  public items: Company[] = []

  async create(data: Company) {
    this.items.push(data)
  }

  async findById(id: string) {
    const company = this.items.find((item) => item.id.toString() === id)

    if (!company) {
      return null
    }

    return company
  }

  async findByCnpj(cnpj: string) {
    const company = this.items.find((item) => item.cnpj.toString() === cnpj)

    if (!company) {
      return null
    }

    return company
  }
}
