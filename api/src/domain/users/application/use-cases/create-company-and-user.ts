import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { CompanyRepository } from '@/domain/users/application/repositories/company-repository'

import { Company } from '../../enterprise/entities/company'
import { User } from '../../enterprise/entities/user'
import { HashGenerator } from '../cryptography/hash-generator'
import { UserRepository } from '../repositories/user-repository'
import { AlreadyExistsCnpjError } from './errors/already-exists-cnpj-error'
import { AlreadyExistsEmailError } from './errors/already-exists-email-error'

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

type CreateCompanyAndUserUseCaseResponse = Either<
  AlreadyExistsCnpjError | AlreadyExistsEmailError,
  null
>

@Injectable()
export class CreateCompanyAndUserUseCase {
  constructor(
    private companyRepository: CompanyRepository,
    private userRepository: UserRepository,
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
    const alreadyCnpj = await this.companyRepository.findByCnpj(cnpj)

    if (alreadyCnpj) {
      return left(new AlreadyExistsCnpjError())
    }

    const alreadyEmail = await this.userRepository.findByEmail(email)

    if (alreadyEmail) {
      return left(new AlreadyExistsEmailError())
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

    await this.companyRepository.create(company)
    await this.userRepository.create(user)

    return right(null)
  }
}
