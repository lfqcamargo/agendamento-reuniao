import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { User } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'

interface GetProfileUseCaseRequest {
  companyId: string
  userAuthenticateId: string
}

type GetProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

@Injectable()
export class GetProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    companyId,
    userAuthenticateId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(
      companyId,
      userAuthenticateId,
    )

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    return right({
      user,
    })
  }
}
