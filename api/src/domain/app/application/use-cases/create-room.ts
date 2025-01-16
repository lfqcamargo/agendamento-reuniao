import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'

import { Room } from '../../enterprise/entities/room'
import { RoomsRepository } from '../repositories/rooms-repository'

interface CreateRoomUseCaseRequest {
  companyId: string
  userId: string
  name: string
  active: boolean
}

type CreateRoomUseCaseResponse = Either<
  ResourceNotFoundError | UserNotAdminError | AlreadyExistsError,
  null
>

@Injectable()
export class CreateRoomUseCase {
  constructor(
    private roomsRepository: RoomsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    companyId,
    userId,
    name,
    active,
  }: CreateRoomUseCaseRequest): Promise<CreateRoomUseCaseResponse> {
    const user = await this.usersRepository.findById(companyId, userId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    if (!user.isAdmin()) {
      return left(new UserNotAdminError())
    }

    const alreadyName = await this.roomsRepository.findByName(companyId, name)

    if (alreadyName) {
      return left(new AlreadyExistsError('Room name already exists.'))
    }

    const room = Room.create({
      companyId: new UniqueEntityID(companyId),
      name,
      active,
    })

    await this.roomsRepository.create(room)

    return right(null)
  }
}
