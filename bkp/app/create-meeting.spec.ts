import { makeRoom } from 'test/factories/make-room'
import { makeRoomScheduling } from 'test/factories/make-room-scheduling'
import { makeUser } from 'test/factories/make-user'
import { InMemoryRoomRepository } from 'test/repositories/in-memory-room-repository'
import { InMemoryRoomSchedulingRepository } from 'test/repositories/in-memory-room-scheduling-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-user-repository'

import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { MeetingParticipantsList } from '../../enterprise/entities/meeting-participants-list'
import { CreateMeetingUseCase } from './create-meeting'

let inMemoryRoomRepository: InMemoryRoomRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRoomSchedulingRepository: InMemoryRoomSchedulingRepository

let sut: CreateMeetingUseCase

describe('CreateMeeting', () => {
  beforeEach(() => {
    inMemoryRoomRepository = new InMemoryRoomRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRoomSchedulingRepository = new InMemoryRoomSchedulingRepository()

    sut = new CreateMeetingUseCase(
      inMemoryUsersRepository,
      inMemoryRoomRepository,
      inMemoryRoomSchedulingRepository,
    )
  })

  it('should be able to create a meeting', async () => {
    const user = makeUser({ role: 1, active: true })
    const room = makeRoom({ companyId: user.companyId })
    inMemoryUsersRepository.items.push(user)
    inMemoryRoomRepository.items.push(room)

    const result = await sut.execute({
      creatorId: user.id.toString(),
      roomId: room.id.toString(),
      startTime: new Date('2024-12-14T10:00:00Z'),
      endTime: new Date('2024-12-14T11:00:00Z'),
      participantsIds: [user.id.toString()],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRoomSchedulingRepository.items.length).toBe(1)
    expect(inMemoryRoomSchedulingRepository.items[0].roomId.toString()).toEqual(
      room.id.toString(),
    )
  })

  it('should not create a meeting if the creator does not exist', async () => {
    const room = makeRoom()
    inMemoryRoomRepository.items.push(room)

    const result = await sut.execute({
      creatorId: 'non-existent-user',
      roomId: room.id.toString(),
      startTime: new Date('2024-12-14T10:00:00Z'),
      endTime: new Date('2024-12-14T11:00:00Z'),
      participantsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not create a meeting if the room does not exist', async () => {
    const user = makeUser({ role: 1, active: true })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      creatorId: user.id.toString(),
      roomId: 'non-existent-room',
      startTime: new Date('2024-12-14T10:00:00Z'),
      endTime: new Date('2024-12-14T11:00:00Z'),
      participantsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not create a meeting if the participant user is not active', async () => {
    const userActive = makeUser({ active: true })
    const userNotActive = makeUser({ active: false })
    const room = makeRoom({ companyId: userActive.companyId })

    inMemoryUsersRepository.items.push(userActive, userNotActive)
    inMemoryRoomRepository.items.push(room)

    const result = await sut.execute({
      creatorId: userActive.id.toString(),
      roomId: room.id.toString(),
      startTime: new Date('2024-12-14T10:00:00Z'),
      endTime: new Date('2024-12-14T11:00:00Z'),
      participantsIds: [userNotActive.id.toString()],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not create a meeting if there is a scheduling conflict', async () => {
    const user = makeUser({ role: 1, active: true })
    const room = makeRoom({ companyId: user.companyId })
    const existingSchedule = makeRoomScheduling({
      companyId: user.companyId,
      creatorId: user.id,
      roomId: room.id,
      startTime: new Date('2024-12-14T10:00:00Z'),
      endTime: new Date('2024-12-14T11:00:00Z'),
      participantsIds: new MeetingParticipantsList([]),
    })

    inMemoryUsersRepository.items.push(user)
    inMemoryRoomRepository.items.push(room)
    inMemoryRoomSchedulingRepository.items.push(existingSchedule)

    const result = await sut.execute({
      creatorId: user.id.toString(),
      roomId: room.id.toString(),
      startTime: new Date('2024-12-14T10:30:00Z'),
      endTime: new Date('2024-12-14T11:30:00Z'),
      participantsIds: [user.id.toString()],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })
})
