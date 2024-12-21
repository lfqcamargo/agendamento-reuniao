import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'

import { MeetingParticipant } from '../../enterprise/entities/meeting-participant'
import { RoomScheduling } from '../../enterprise/entities/room-scheduling'
import { RoomRepository } from '../repositories/room-repository'
import { RoomSchedulingRepository } from '../repositories/room-scheduling-repository'

interface CreateMeetingRequest {
  creatorId: string
  roomId: string
  startTime: Date
  endTime: Date
  participantsIds: string[]
}

type CreateMeetingUseCaseResponse = Either<
  ResourceNotFoundError | AlreadyExistsError,
  null
>

@Injectable()
export class CreateMeetingUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private roomRepository: RoomRepository,
    private roomSchedulingRepository: RoomSchedulingRepository,
  ) {}

  async execute({
    creatorId,
    roomId,
    startTime,
    endTime,
    participantsIds,
  }: CreateMeetingRequest): Promise<CreateMeetingUseCaseResponse> {
    const creatorUser = await this.usersRepository.findById(creatorId)

    if (!creatorUser) {
      return left(new ResourceNotFoundError('Users creator not found.'))
    }

    const room = await this.roomRepository.findById(roomId)

    if (!room) {
      return left(new ResourceNotFoundError('Room not found.'))
    }

    const scheduledTimes =
      await this.roomSchedulingRepository.fetchScheduledTimes(
        creatorUser.companyId.toString(),
        roomId,
        startTime,
        endTime,
      )

    if (scheduledTimes) {
      return left(new AlreadyExistsError('There is already a schedule'))
    }

    const roomSchedule = RoomScheduling.create({
      companyId: creatorUser.companyId,
      creatorId: creatorUser.id,
      roomId: room.id,
      startTime,
      endTime,
    })

    for (const participantId of participantsIds) {
      const user = await this.usersRepository.findById(participantId)

      if (!user) {
        return left(new ResourceNotFoundError('User participant not found.'))
      }

      if (!user.active) {
        return left(new ResourceNotFoundError('User not active.'))
      }

      const meetingParticipant = MeetingParticipant.create({
        companyId: creatorUser.companyId,
        participantId: user.id,
        roomSchedulingId: roomSchedule.id,
      })

      try {
        roomSchedule.addParticipant(meetingParticipant)
      } catch (error) {
        if (error instanceof Error) {
          return left(error)
        }
      }
    }

    await this.roomSchedulingRepository.create(roomSchedule)

    return right(null)
  }
}
