import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { User } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/user-repository'

interface FindUserByIdUseCaseRequest {
  userAuthenticateId: string
  id: string
}

type FindUserByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

@Injectable()
export class FindUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userAuthenticateId,
    id,
  }: FindUserByIdUseCaseRequest): Promise<FindUserByIdUseCaseResponse> {
    const user = await this.userRepository.findById(userAuthenticateId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    const findUser = await this.userRepository.findById(id)

    if (!findUser) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    if (user.companyId.toString() !== findUser.companyId.toString()) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    return right({
      user: findUser,
    })
  }
}
