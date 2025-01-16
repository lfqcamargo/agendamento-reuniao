import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'

import { MeetingParticipant } from '../../enterprise/entities/meeting-participant'
import { MeetingsRepository } from '../repositories/meetings-repository'

interface AddParticipantRequest {
  companyId: string
  userId: string
  participantId: string
  meetingId: string
}

type AddParticipantUseCaseResponse = Either<
  ResourceNotFoundError | AlreadyExistsError | UserNotAdminError,
  null
>

@Injectable()
export class AddParticipantUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private meetingRepository: MeetingsRepository,
  ) {}

  async execute({
    companyId,
    userId,
    participantId,
    meetingId,
  }: AddParticipantRequest): Promise<AddParticipantUseCaseResponse> {
    const user = await this.usersRepository.findById(companyId, userId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    const participant = await this.usersRepository.findById(
      companyId,
      participantId,
    )

    if (!participant) {
      return left(new ResourceNotFoundError('Users partcipant not found.'))
    }

    const meeting = await this.meetingRepository.findById(companyId, meetingId)

    if (!meeting) {
      return left(new ResourceNotFoundError('Room scheduling not found.'))
    }

    if (
      !user.isAdmin() &&
      user.id.toString() !== meeting.creatorId.toString()
    ) {
      return left(new UserNotAdminError())
    }

    const meetingParticipant = MeetingParticipant.create({
      companyId: participant.companyId,
      participantId: participant.id,
      meetingId: meeting.id,
    })

    try {
      meeting.addParticipant(meetingParticipant)
    } catch (error) {
      if (error instanceof Error) {
        return left(error)
      }
    }

    await this.meetingRepository.save(meeting)

    return right(null)
  }
}
