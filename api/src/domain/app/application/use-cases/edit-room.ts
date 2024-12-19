import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin'
import { UserNotCompanyError } from '@/core/errors/user-not-company'
import { UserRepository } from '@/domain/users/application/repositories/user-repository'

import { RoomRepository } from '../repositories/room-repository'

interface EditRoomUseCaseRequest {
  userId: string
  roomId: string
  name?: string
  active?: boolean
}

type EditRoomUseCaseResponse = Either<
  | ResourceNotFoundError
  | UserNotAdminError
  | AlreadyExistsError
  | UserNotCompanyError,
  null
>

@Injectable()
export class EditRoomUseCase {
  constructor(
    private roomRepository: RoomRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
    roomId,
    name,
    active,
  }: EditRoomUseCaseRequest): Promise<EditRoomUseCaseResponse> {
    const room = await this.roomRepository.findById(roomId)

    if (!room) {
      return left(new ResourceNotFoundError('Room not found.'))
    }

    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    if (user.role !== 1) {
      return left(new UserNotAdminError())
    }

    if (user.companyId.toString() !== room.companyId.toString()) {
      return left(new UserNotCompanyError())
    }

    if (name) {
      const alreadyName = await this.roomRepository.findByName(
        user.companyId.toString(),
        name,
      )

      if (alreadyName) {
        return left(new AlreadyExistsError('Room name already exists.'))
      }

      room.name = name
    }

    if (active) {
      room.active = active
    }

    await this.roomRepository.save(room)

    return right(null)
  }
}
