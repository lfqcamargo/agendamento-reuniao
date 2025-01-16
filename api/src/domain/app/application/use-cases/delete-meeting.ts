import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'

import { MeetingsRepository } from '../repositories/meetings-repository'

interface DeleteMeetingRequest {
  companyId: string
  userId: string
  meetingId: string
}

type DeleteMeetingUseCaseResponse = Either<
  ResourceNotFoundError | UserNotAdminError,
  null
>

@Injectable()
export class DeleteMeetingUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private meetingRepository: MeetingsRepository,
  ) {}

  async execute({
    companyId,
    userId,
    meetingId,
  }: DeleteMeetingRequest): Promise<DeleteMeetingUseCaseResponse> {
    const meeting = await this.meetingRepository.findById(companyId, meetingId)

    if (!meeting) {
      return left(new ResourceNotFoundError('Meeting not found.'))
    }

    const user = await this.usersRepository.findById(companyId, userId)

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    if (!user.isAdmin() && meeting.creatorId.toString() !== userId) {
      return left(new UserNotAdminError())
    }

    await this.meetingRepository.delete(meeting)

    return right(null)
  }
}
