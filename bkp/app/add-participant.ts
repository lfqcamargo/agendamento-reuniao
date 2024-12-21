import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotCompanyError } from '@/core/errors/user-not-company'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'

import { MeetingParticipant } from '../../enterprise/entities/meeting-participant'
import { RoomSchedulingRepository } from '../repositories/room-scheduling-repository'

interface AddParticipantRequest {
  participantId: string
  roomSchedulesId: string
}

type AddParticipantUseCaseResponse = Either<
  ResourceNotFoundError | AlreadyExistsError | UserNotCompanyError,
  null
>

@Injectable()
export class AddParticipantUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private roomSchedulingRepository: RoomSchedulingRepository,
  ) {}

  async execute({
    participantId,
    roomSchedulesId,
  }: AddParticipantRequest): Promise<AddParticipantUseCaseResponse> {
    const participant = await this.usersRepository.findById(participantId)

    if (!participant) {
      return left(new ResourceNotFoundError('Users creator not found.'))
    }

    const roomScheduling =
      await this.roomSchedulingRepository.findById(roomSchedulesId)

    if (!roomScheduling) {
      return left(new ResourceNotFoundError('Room scheduling not found.'))
    }

    if (
      participant.companyId.toString() !== roomScheduling.companyId.toString()
    ) {
      return left(new UserNotCompanyError())
    }

    const meetingParticipant = MeetingParticipant.create({
      companyId: participant.companyId,
      participantId: participant.id,
      roomSchedulingId: roomScheduling.id,
    })

    try {
      roomScheduling.addParticipant(meetingParticipant)
    } catch (error) {
      if (error instanceof Error) {
        return left(error)
      }
    }

    await this.roomSchedulingRepository.save(roomScheduling)

    return right(null)
  }
}
