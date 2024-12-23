import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Room } from '../../enterprise/entities/room'
import { RoomsRepository } from '../repositories/rooms-repository'

interface FetchRoomsByCompanyIdUseCaseRequest {
  companyId: string
  page: number
  itemsPerPage: number
}

type FetchRoomsByCompanyIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    rooms: Room[]
    meta: {
      totalItems: number
      itemCount: number
      itemsPerPage: number
      totalPages: number
      currentPage: number
    }
  }
>

@Injectable()
export class FetchRoomsByCompanyIdUseCase {
  constructor(private roomsRepository: RoomsRepository) {}

  async execute({
    companyId,
    page,
    itemsPerPage,
  }: FetchRoomsByCompanyIdUseCaseRequest): Promise<FetchRoomsByCompanyIdUseCaseResponse> {
    const result = await this.roomsRepository.fetchByCompanyId(
      companyId,
      page,
      itemsPerPage,
    )

    if (!result || !result.data) {
      return left(new ResourceNotFoundError('No rooms found.'))
    }

    return right({
      rooms: result.data,
      meta: result.meta,
    })
  }
}
