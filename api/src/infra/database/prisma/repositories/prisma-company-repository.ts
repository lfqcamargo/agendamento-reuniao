import { Injectable } from '@nestjs/common'

import { CompanyRepository } from '@/domain/users/application/repositories/company-repository'
import { Company } from '@/domain/users/enterprise/entities/company'

import { PrismaCompanyMapper } from '../mappers/prisma-company-mapper'
import { PrismaService } from '../prisma-service'

@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private prisma: PrismaService) {}
  async findByCnpj(cnpj: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: {
        cnpj,
      },
    })

    if (!company) {
      return null
    }

    return PrismaCompanyMapper.toDomain(company)
  }

  async create(company: Company): Promise<void> {
    const data = PrismaCompanyMapper.toPrisma(company)

    await this.prisma.company.create({
      data,
    })
  }

  async findById(id: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: {
        id,
      },
    })

    if (!company) {
      return null
    }

    return PrismaCompanyMapper.toDomain(company)
  }
}
