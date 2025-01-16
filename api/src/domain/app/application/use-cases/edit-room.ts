import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'

import { RoomsRepository } from '../repositories/rooms-repository'

interface EditRoomUseCaseRequest {
  companyId: string
  userId: string
  roomId: string
  name?: string
  active?: boolean
}

type EditRoomUseCaseResponse = Either<
  ResourceNotFoundError | UserNotAdminError | AlreadyExistsError,
  null
>

@Injectable()
export class EditRoomUseCase {
  constructor(
    private roomRepository: RoomsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    companyId,
    userId,
    roomId,
    name,
    active,
  }: EditRoomUseCaseRequest): Promise<EditRoomUseCaseResponse> {
    const room = await this.roomRepository.findById(companyId, roomId)

    if (!room) {
      return left(new ResourceNotFoundError('Room not found.'))
    }

    const user = await this.usersRepository.findById(companyId, userId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    if (!user.isAdmin()) {
      return left(new UserNotAdminError())
    }

    if (name) {
      const alreadyName = await this.roomRepository.findByName(companyId, name)

      if (alreadyName) {
        return left(new AlreadyExistsError('Room name already exists.'))
      }

      room.name = name
    }

    if (active !== undefined) {
      room.active = active
    }

    await this.roomRepository.save(room)

    return right(null)
  }
}
