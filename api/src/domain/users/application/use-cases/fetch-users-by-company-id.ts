import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { User } from '../../enterprise/entities/user'
import { CompaniesRepository } from '../repositories/companies-repository'
import { UsersRepository } from '../repositories/users-repository'

interface FetchUsersByCompanyIdUseCaseRequest {
  companyId: string
  page: number
  itemsPerPage?: number
}

type FetchUsersByCompanyIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    users: User[]
    meta: {
      totalItems: number
      itemCount: number
      itemsPerPage: number
      totalPages: number
      currentPage: number
    }
  }
>

@Injectable()
export class FetchUsersByCompanyIdUseCase {
  constructor(
    private companyRepository: CompaniesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    companyId,
    page,
    itemsPerPage,
  }: FetchUsersByCompanyIdUseCaseRequest): Promise<FetchUsersByCompanyIdUseCaseResponse> {
    const company = await this.companyRepository.findById(companyId)

    if (!company) {
      return left(new ResourceNotFoundError('Company not found.'))
    }

    const result = await this.usersRepository.fetchUsersByCompanyId(
      companyId,
      page,
      itemsPerPage,
    )

    if (!result || !result.data || result.data?.length === 0) {
      return left(new ResourceNotFoundError('Users not found.'))
    }

    return right({
      users: result.data,
      meta: result.meta,
    })
  }
}
