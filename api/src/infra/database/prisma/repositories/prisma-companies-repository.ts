import { Injectable } from '@nestjs/common'

import { CompaniesRepository } from '@/domain/users/application/repositories/companies-repository'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'
import { Company } from '@/domain/users/enterprise/entities/company'

import { PrismaCompanyMapper } from '../mappers/prisma-company-mapper'
import { PrismaService } from '../prisma-service'

@Injectable()
export class PrismaCompaniesRepository implements CompaniesRepository {
  constructor(
    private prisma: PrismaService,
    private usersRepository: UsersRepository,
  ) {}

  async create(company: Company): Promise<void> {
    const data = PrismaCompanyMapper.toPrisma(company)

    await this.prisma.company.create({
      data,
    })

    await this.usersRepository.createMany(company.users)
  }

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
