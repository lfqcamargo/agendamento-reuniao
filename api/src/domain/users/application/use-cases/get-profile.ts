import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { User } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/user-repository'

interface GetProfileUseCaseRequest {
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
  constructor(private userRepository: UserRepository) {}

  async execute({
    userAuthenticateId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userAuthenticateId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    return right({
      user,
    })
  }
}
