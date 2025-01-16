import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { CompaniesRepository } from '@/domain/users/application/repositories/companies-repository'

import { Company } from '../../enterprise/entities/company'
import { User } from '../../enterprise/entities/user'
import { HashGenerator } from '../cryptography/hash-generator'
import { UsersRepository } from '../repositories/users-repository'

interface CreateCompanyRequest {
  cnpj: string
  companyName: string
}

interface CreateUserRequest {
  email: string
  name: string
  nickname: string
  password: string
}

type CreateCompanyAndUserRequest = CreateCompanyRequest & CreateUserRequest

type CreateCompanyAndUserUseCaseResponse = Either<AlreadyExistsError, null>

@Injectable()
export class CreateCompanyAndUserUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    cnpj,
    companyName,
    email,
    name,
    nickname,
    password,
  }: CreateCompanyAndUserRequest): Promise<CreateCompanyAndUserUseCaseResponse> {
    const alreadyCnpj = await this.companiesRepository.findByCnpj(cnpj)

    if (alreadyCnpj) {
      return left(new AlreadyExistsError('Already exists cnpj'))
    }

    const alreadyEmail = await this.usersRepository.findByEmail(email)

    if (alreadyEmail) {
      return left(new AlreadyExistsError('Already exists email'))
    }

    const company = Company.create({
      cnpj,
      name: companyName,
    })

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      companyId: company.id,
      email,
      name,
      nickname,
      password: hashedPassword,
      role: 1,
      active: true,
    })

    company.users.push(user)

    await this.companiesRepository.create(company)

    return right(null)
  }
}
