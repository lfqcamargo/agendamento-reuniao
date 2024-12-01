import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin'
import { UserRepository } from '@/domain/users/application/repositories/user-repository'

import { Room } from '../../enterprise/entities/room'
import { RoomRepository } from '../repositories/room-repository'

interface CreateRoomUseCaseRequest {
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
    private roomRepository: RoomRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
    name,
    active,
  }: CreateRoomUseCaseRequest): Promise<CreateRoomUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    } else if (user.role !== 1) {
      return left(new UserNotAdminError())
    }

    const alreadyName = await this.roomRepository.findByName(
      user.companyId.toString(),
      name,
    )

    if (alreadyName) {
      return left(new AlreadyExistsError('Room name already exists.'))
    }

    const room = Room.create({
      companyId: new UniqueEntityID(user.companyId.toString()),
      name,
      active,
    })

    await this.roomRepository.create(room)

    return right(null)
  }
}
