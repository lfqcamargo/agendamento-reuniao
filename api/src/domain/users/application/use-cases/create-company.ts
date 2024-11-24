import { Either, left, right } from '@/core/either'
import { CompanyRepository } from '@/domain/users/application/repositories/company-repository'

import { Company } from '../../enterprise/entities/company'
import { AlreadyExistsCnpjError } from './errors/already-exists-cnpj-error'

interface CreateCompanyRequest {
  cnpj: string
  name: string
}

type CreateCompanyUseCaseResponse = Either<AlreadyExistsCnpjError, null>

export class CreateCompanyUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute({
    cnpj,
    name,
  }: CreateCompanyRequest): Promise<CreateCompanyUseCaseResponse> {
    const alreadyCnpj = await this.companyRepository.findByCnpj(cnpj)

    if (alreadyCnpj) {
      return left(new AlreadyExistsCnpjError())
    }

    const company = Company.create({
      cnpj,
      name,
    })

    await this.companyRepository.create(company)

    return right(null)
  }
}
