import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SystemDoesNotAllowError } from '@/core/errors/system-does-not-allow'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'

import { Meeting } from '../../enterprise/entities/meeting'
import { MeetingParticipant } from '../../enterprise/entities/meeting-participant'
import { MeetingsRepository } from '../repositories/meetings-repository'
import { RoomsRepository } from '../repositories/rooms-repository'

interface CreateMeetingRequest {
  companyId: string
  creatorId: string
  roomId: string
  startTime: Date
  endTime: Date
  participantsIds: string[]
}

type CreateMeetingUseCaseResponse = Either<
  ResourceNotFoundError | AlreadyExistsError | SystemDoesNotAllowError,
  null
>

@Injectable()
export class CreateMeetingUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private roomsRepository: RoomsRepository,
    private meetingsRepository: MeetingsRepository,
  ) {}

  async execute({
    companyId,
    creatorId,
    roomId,
    startTime,
    endTime,
    participantsIds,
  }: CreateMeetingRequest): Promise<CreateMeetingUseCaseResponse> {
    const creatorUser = await this.usersRepository.findById(
      companyId,
      creatorId,
    )

    if (!creatorUser) {
      return left(new ResourceNotFoundError('Users creator not found.'))
    }

    const room = await this.roomsRepository.findById(companyId, roomId)

    if (!room) {
      return left(new ResourceNotFoundError('Room not found.'))
    }

    const scheduledTimes = await this.meetingsRepository.fetchScheduledTimes(
      companyId,
      roomId,
      startTime,
      endTime,
      1,
      1,
    )

    if (
      scheduledTimes &&
      scheduledTimes.data &&
      scheduledTimes.data.length > 0
    ) {
      return left(new AlreadyExistsError('There is already a schedule.'))
    }

    const roomSchedule = Meeting.create({
      companyId: creatorUser.companyId,
      creatorId: creatorUser.id,
      roomId: room.id,
      startTime,
      endTime,
    })

    for (const participantId of participantsIds) {
      const user = await this.usersRepository.findById(companyId, participantId)

      if (!user) {
        return left(new ResourceNotFoundError('User participant not found.'))
      }

      if (!user.active) {
        return left(new SystemDoesNotAllowError('User not active.'))
      }

      const meetingParticipant = MeetingParticipant.create({
        companyId: creatorUser.companyId,
        participantId: user.id,
        meetingId: roomSchedule.id,
      })

      try {
        roomSchedule.addParticipant(meetingParticipant)
      } catch (error) {
        if (error instanceof Error) {
          return left(error)
        }
      }
    }

    await this.meetingsRepository.create(roomSchedule)

    return right(null)
  }
}
