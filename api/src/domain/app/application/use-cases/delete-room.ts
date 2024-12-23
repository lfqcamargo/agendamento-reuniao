import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'

import { RoomsRepository } from '../repositories/rooms-repository'

interface DeleteRoomUseCaseRequest {
  companyId: string
  userId: string
  roomId: string
}

type DeleteRoomUseCaseResponse = Either<
  ResourceNotFoundError | UserNotAdminError,
  null
>

@Injectable()
export class DeleteRoomUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private roomsRepository: RoomsRepository,
  ) {}

  async execute({
    companyId,
    userId,
    roomId,
  }: DeleteRoomUseCaseRequest): Promise<DeleteRoomUseCaseResponse> {
    const user = await this.usersRepository.findById(companyId, userId)

    if (!user) {
      return left(new ResourceNotFoundError('User admin not found.'))
    }

    if (user.role !== 1) {
      return left(new UserNotAdminError())
    }

    const room = await this.roomsRepository.findById(companyId, roomId)

    if (!room) {
      return left(new ResourceNotFoundError('Room not found.'))
    }

    await this.roomsRepository.delete(room)

    return right(null)
  }
}
