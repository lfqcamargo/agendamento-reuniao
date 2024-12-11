import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserRepository } from '@/domain/users/application/repositories/user-repository'

import { Room } from '../../enterprise/entities/room'
import { RoomRepository } from '../repositories/room-repository'

interface FindRoomByIdUseCaseRequest {
  userAuthenticateId: string
  id: string
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
    private userRepository: UserRepository,
    private roomRepository: RoomRepository,
  ) {}

  async execute({
    userAuthenticateId,
    id,
  }: FindRoomByIdUseCaseRequest): Promise<FindRoomByIdUseCaseResponse> {
    const user = await this.userRepository.findById(userAuthenticateId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    const room = await this.roomRepository.findById(id)

    if (!room) {
      return left(new ResourceNotFoundError('Room not found.'))
    }

    if (user.companyId.toString() !== room.companyId.toString()) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    return right({
      room,
    })
  }
}
