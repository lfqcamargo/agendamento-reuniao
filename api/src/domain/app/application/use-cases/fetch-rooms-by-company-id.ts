import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserRepository } from '@/domain/users/application/repositories/user-repository'

import { Room } from '../../enterprise/entities/room'
import { RoomRepository } from '../repositories/room-repository'

interface FetchRoomsByCompanyIdUseCaseRequest {
  userAuthenticateId: string
  page: number
}

type FetchRoomsByCompanyIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    rooms: Room[]
  }
>

@Injectable()
export class FetchRoomsByCompanyIdUseCase {
  constructor(
    private userRepository: UserRepository,
    private roomRepository: RoomRepository,
  ) {}

  async execute({
    userAuthenticateId,
    page,
  }: FetchRoomsByCompanyIdUseCaseRequest): Promise<FetchRoomsByCompanyIdUseCaseResponse> {
    const user = await this.userRepository.findById(userAuthenticateId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    const rooms = await this.roomRepository.fetchByCompany(
      user.companyId.toString(),
      page,
    )

    if (!rooms) {
      return left(new ResourceNotFoundError('No rooms found.'))
    }

    return right({
      rooms,
    })
  }
}
