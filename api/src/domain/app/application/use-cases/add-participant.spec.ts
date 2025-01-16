import { makeMeeting } from 'test/factories/make-meetings'
import { makeUser } from 'test/factories/make-user'
import { InMemoryMeetingsRepository } from 'test/repositories/in-memory-meetings-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'

import { MeetingParticipantsList } from '../../enterprise/entities/meeting-participants-list'
import { AddParticipantUseCase } from './add-participant'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryMeetingsRepository: InMemoryMeetingsRepository

let sut: AddParticipantUseCase

describe('AddParticipant', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryMeetingsRepository = new InMemoryMeetingsRepository()

    sut = new AddParticipantUseCase(
      inMemoryUsersRepository,
      inMemoryMeetingsRepository,
    )
  })

  it('should add participant successfully', async () => {
    const userCreator = makeUser({ active: true })
    const user = makeUser({ companyId: userCreator.companyId, active: true })
    const meeting = makeMeeting({
      companyId: user.companyId,
      participantsIds: new MeetingParticipantsList([]),
    })

    inMemoryUsersRepository.items.push(userCreator)
    inMemoryUsersRepository.items.push(user)
    inMemoryMeetingsRepository.items.push(meeting)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userId: userCreator.id.toString(),
      participantId: user.id.toString(),
      roomSchedulesId: meeting.id.toString(),
    })

    expect(result.isRight()).toBe(true)
  })

  it('should fail if participant does not exist', async () => {
    const userCreator = makeUser({ active: true })
    const meeting = makeMeeting()

    inMemoryUsersRepository.items.push(userCreator)
    inMemoryMeetingsRepository.items.push(meeting)

    const result = await sut.execute({
      companyId: userCreator.companyId.toString(),
      userId: userCreator.id.toString(),
      participantId: 'non-existent-participant',
      roomSchedulesId: meeting.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should fail if meeting does not exist', async () => {
    const userCreator = makeUser({ active: true })
    const user = makeUser({ companyId: userCreator.companyId, active: true })

    inMemoryUsersRepository.items.push(userCreator)
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      companyId: userCreator.companyId.toString(),
      userId: userCreator.id.toString(),
      participantId: user.id.toString(),
      roomSchedulesId: 'non-existent-scheduling',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should fail if user not creator and admin', async () => {
    const userCreator = makeUser({ active: true })
    const user = makeUser({
      companyId: userCreator.companyId,
      active: true,
      role: 2,
    })
    const meeting = makeMeeting({
      companyId: user.companyId,
      participantsIds: new MeetingParticipantsList([]),
    })

    inMemoryUsersRepository.items.push(userCreator)
    inMemoryUsersRepository.items.push(user)
    inMemoryMeetingsRepository.items.push(meeting)

    const result = await sut.execute({
      companyId: userCreator.companyId.toString(),
      userId: user.id.toString(),
      participantId: user.id.toString(),
      roomSchedulesId: meeting.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNotAdminError)
  })
})
