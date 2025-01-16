import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'

import { Room } from '../../enterprise/entities/room'
import { RoomsRepository } from '../repositories/rooms-repository'

interface FindRoomByIdUseCaseRequest {
  companyId: string
  userId: string
  roomId: string
}

type FindRoomByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    room: Room
  }
>

@Injectable()
export class FindRoomByIdUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private roomsRepository: RoomsRepository,
  ) {}

  async execute({
    companyId,
    userId,
    roomId,
  }: FindRoomByIdUseCaseRequest): Promise<FindRoomByIdUseCaseResponse> {
    const user = await this.usersRepository.findById(companyId, userId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    const room = await this.roomsRepository.findById(companyId, roomId)

    if (!room) {
      return left(new ResourceNotFoundError('Room not found.'))
    }

    return right({
      room,
    })
  }
}
