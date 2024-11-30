import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SystemDoesNotAllowError } from '@/core/errors/system-does-not-allow'
import { UserNotAdminError } from '@/core/errors/user-not-admin'
import { UserNotCompanyError } from '@/core/errors/user-not-company'

import { UserRepository } from '../repositories/user-repository'

interface DeleteUserUseCaseRequest {
  adminId: string
  id: string
}

type DeleteUserUseCaseResponse = Either<
  | ResourceNotFoundError
  | UserNotAdminError
  | SystemDoesNotAllowError
  | UserNotCompanyError,
  null
>

@Injectable()
export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    adminId,
    id,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const userAdmin = await this.userRepository.findById(adminId)

    if (!userAdmin) {
      return left(new ResourceNotFoundError('User admin not found.'))
    }

    if (userAdmin.role !== 1) {
      return left(new UserNotAdminError())
    }

    const user = await this.userRepository.findById(id)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    if (user.id.toString() === userAdmin.id.toString()) {
      return left(new SystemDoesNotAllowError())
    }

    if (user.companyId.toString() !== userAdmin.companyId.toString()) {
      return left(new UserNotCompanyError())
    }

    await this.userRepository.delete(user)

    return right(null)
  }
}
