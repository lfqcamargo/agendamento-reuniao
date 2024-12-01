import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin'
import { UserNotCompanyError } from '@/core/errors/user-not-company'
import { UserRepository } from '@/domain/users/application/repositories/user-repository'

import { RoomRepository } from '../repositories/room-repository'

interface DeleteRoomUseCaseRequest {
  userId: string
  roomId: string
}

type DeleteRoomUseCaseResponse = Either<
  ResourceNotFoundError | UserNotAdminError | UserNotCompanyError,
  null
>

@Injectable()
export class DeleteRoomUseCase {
  constructor(
    private userRepository: UserRepository,
    private roomRepository: RoomRepository,
  ) {}

  async execute({
    userId,
    roomId,
  }: DeleteRoomUseCaseRequest): Promise<DeleteRoomUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError('User admin not found.'))
    }

    if (user.role !== 1) {
      return left(new UserNotAdminError())
    }

    const room = await this.roomRepository.findById(roomId)

    if (!room) {
      return left(new ResourceNotFoundError('Room not found.'))
    }

    if (user.companyId.toString() !== room.companyId.toString()) {
      return left(new UserNotCompanyError())
    }

    await this.roomRepository.delete(room)

    return right(null)
  }
}
