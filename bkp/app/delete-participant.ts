import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SystemDoesNotAllowError } from '@/core/errors/system-does-not-allow'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'

import { MeetingParticipantsRepository } from '../repositories/meeting-participants-repository'

interface DeleteParticipantRequest {
  userAuthenticateId: string
  meetingParticipantId: string
}

type DeleteParticipantUseCaseResponse = Either<
  ResourceNotFoundError | SystemDoesNotAllowError,
  null
>

@Injectable()
export class DeleteParticipantUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private meetingParticipantsRepository: MeetingParticipantsRepository,
  ) {}

  async execute({
    userAuthenticateId,
    meetingParticipantId,
  }: DeleteParticipantRequest): Promise<DeleteParticipantUseCaseResponse> {
    const user = await this.usersRepository.findById(userAuthenticateId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found'))
    }

    const meetingParticipant =
      await this.meetingParticipantsRepository.findById(meetingParticipantId)

    if (!meetingParticipant) {
      return left(new ResourceNotFoundError('Participant not found.'))
    }

    if (
      user.role !== 1 &&
      user.id.toString() !== meetingParticipant.participantId.toString()
    ) {
      return left(new SystemDoesNotAllowError())
    }

    await this.meetingParticipantsRepository.delete(meetingParticipant)

    return right(null)
  }
}
