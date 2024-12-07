import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { User } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/user-repository'

interface FetchUsersByCompanyIdUseCaseRequest {
  userAuthenticateId: string
  page: number
}

type FetchUsersByCompanyIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    users: User[]
  }
>

@Injectable()
export class FetchUsersByCompanyIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userAuthenticateId,
    page,
  }: FetchUsersByCompanyIdUseCaseRequest): Promise<FetchUsersByCompanyIdUseCaseResponse> {
    const user = await this.userRepository.findById(userAuthenticateId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    const users = await this.userRepository.fetchUsersByCompanyId(
      user.companyId.toString(),
      page,
    )

    if (!users) {
      return left(new ResourceNotFoundError('No users found.'))
    }

    return right({
      users,
    })
  }
}
