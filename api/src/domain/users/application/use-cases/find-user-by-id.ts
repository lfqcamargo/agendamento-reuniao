import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { User } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'

interface FindUserByIdUseCaseRequest {
  companyId: string
  userId: string
}

type FindUserByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

@Injectable()
export class FindUserByIdUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    companyId,
    userId,
  }: FindUserByIdUseCaseRequest): Promise<FindUserByIdUseCaseResponse> {
    const user = await this.usersRepository.findById(companyId, userId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    return right({
      user,
    })
  }
}
