import { Company as PrismaCompany, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Company } from '@/domain/users/enterprise/entities/company'

export class PrismaCompanyMapper {
  static toDomain(raw: PrismaCompany): Company {
    const company = Company.create(
      {
        cnpj: raw.cnpj,
        name: raw.name,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )

    return company
  }

  static toPrisma(company: Company): Prisma.CompanyUncheckedCreateInput {
    return {
      id: company.id.toString(),
      cnpj: company.cnpj,
      name: company.name,
      createdAt: company.createdAt,
    }
  }
}
