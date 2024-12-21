import { makeRoomScheduling } from 'test/factories/make-room-scheduling'
import { makeUser } from 'test/factories/make-user'
import { InMemoryRoomSchedulingRepository } from 'test/repositories/in-memory-room-scheduling-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-user-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotCompanyError } from '@/core/errors/user-not-company'

import { MeetingParticipantsList } from '../../enterprise/entities/meeting-participants-list'
import { AddParticipantUseCase } from './add-participant'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRoomSchedulingRepository: InMemoryRoomSchedulingRepository

let sut: AddParticipantUseCase

describe('AddParticipant', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRoomSchedulingRepository = new InMemoryRoomSchedulingRepository()

    sut = new AddParticipantUseCase(
      inMemoryUsersRepository,
      inMemoryRoomSchedulingRepository,
    )
  })

  it('should add participant successfully', async () => {
    const user = makeUser({ active: true })
    const roomScheduling = makeRoomScheduling({
      companyId: user.companyId,
      participantsIds: new MeetingParticipantsList([]),
    })

    inMemoryUsersRepository.items.push(user)
    inMemoryRoomSchedulingRepository.items.push(roomScheduling)

    const result = await sut.execute({
      participantId: user.id.toString(),
      roomSchedulesId: roomScheduling.id.toString(),
    })

    expect(result.isRight()).toBe(true)
  })

  it('should fail if participant does not exist', async () => {
    const roomScheduling = makeRoomScheduling()

    inMemoryRoomSchedulingRepository.items.push(roomScheduling)

    const result = await sut.execute({
      participantId: 'non-existent-participant',
      roomSchedulesId: roomScheduling.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should fail if room scheduling does not exist', async () => {
    const user = makeUser({ active: true })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      participantId: user.id.toString(),
      roomSchedulesId: 'non-existent-scheduling',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should fail if participant from different company', async () => {
    const user = makeUser({ active: true })
    const anotherUser = makeUser({
      active: true,
      companyId: new UniqueEntityID('another-company'),
    })
    const roomScheduling = makeRoomScheduling({
      companyId: user.companyId,
    })

    inMemoryUsersRepository.items.push(user, anotherUser)
    inMemoryRoomSchedulingRepository.items.push(roomScheduling)

    const result = await sut.execute({
      participantId: anotherUser.id.toString(),
      roomSchedulesId: roomScheduling.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNotCompanyError)
  })
})
