import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { RoomSchedulingRepository } from '../repositories/room-scheduling-repository'

interface DeleteMeetingRequest {
  meetingId: string
}

type DeleteMeetingUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteMeetingUseCase {
  constructor(private roomSchedulingRepository: RoomSchedulingRepository) {}

  async execute({
    meetingId,
  }: DeleteMeetingRequest): Promise<DeleteMeetingUseCaseResponse> {
    const roomScheduling =
      await this.roomSchedulingRepository.findById(meetingId)

    if (!roomScheduling) {
      return left(new ResourceNotFoundError('Meeting not found.'))
    }

    await this.roomSchedulingRepository.delete(roomScheduling)

    return right(null)
  }
}
