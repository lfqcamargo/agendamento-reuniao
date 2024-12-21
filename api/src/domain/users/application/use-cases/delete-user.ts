import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SystemDoesNotAllowError } from '@/core/errors/system-does-not-allow'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'

import { UsersRepository } from '../repositories/users-repository'

interface DeleteUserUseCaseRequest {
  companyId: string
  userAuthenticateId: string
  userId: string
}

type DeleteUserUseCaseResponse = Either<
  ResourceNotFoundError | SystemDoesNotAllowError | UserNotAdminError,
  null
>

@Injectable()
export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    companyId,
    userAuthenticateId,
    userId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const userAuthenticate = await this.usersRepository.findById(
      companyId,
      userAuthenticateId,
    )

    if (!userAuthenticate) {
      return left(new ResourceNotFoundError('User admin not found.'))
    }

    if (!userAuthenticate.isAdmin()) {
      return left(new UserNotAdminError())
    }

    const user = await this.usersRepository.findById(companyId, userId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    if (user.id.toString() === userAuthenticate.id.toString()) {
      return left(new SystemDoesNotAllowError('Deleting is not allowed'))
    }

    await this.usersRepository.delete(user)

    return right(null)
  }
}
