import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { CompaniesRepository } from '@/domain/users/application/repositories/companies-repository'

import { Company } from '../../enterprise/entities/company'
import { AlreadyExistsCnpjError } from './errors/already-exists-cnpj-error'

interface CreateCompanyRequest {
  cnpj: string
  name: string
}

type CreateCompanyUseCaseResponse = Either<AlreadyExistsCnpjError, null>

@Injectable()
export class CreateCompanyUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    cnpj,
    name,
  }: CreateCompanyRequest): Promise<CreateCompanyUseCaseResponse> {
    const alreadyCnpj = await this.companiesRepository.findByCnpj(cnpj)

    if (alreadyCnpj) {
      return left(new AlreadyExistsCnpjError())
    }

    const company = Company.create({
      cnpj,
      name,
    })

    await this.companiesRepository.create(company)

    return right(null)
  }
}
