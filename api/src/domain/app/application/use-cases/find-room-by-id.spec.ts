import { makeRoom } from 'test/factories/make-room'
import { makeUser } from 'test/factories/make-user'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { FindRoomByIdUseCase } from './find-room-by-id'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRoomsRepository: InMemoryRoomsRepository
let sut: FindRoomByIdUseCase

describe('FindRoomByIdUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRoomsRepository = new InMemoryRoomsRepository()
    sut = new FindRoomByIdUseCase(
      inMemoryUsersRepository,
      inMemoryRoomsRepository,
    )
  })

  it('should be able to find a room by id', async () => {
    const user = makeUser()
    const room = makeRoom({ companyId: user.companyId })
    await inMemoryUsersRepository.create(user)
    await inMemoryRoomsRepository.create(room)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userId: user.id.toString(),
      roomId: room.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.room).toEqual(room)
    }
  })

  it('should return an error if the user is not found', async () => {
    const room = makeRoom()

    const result = await sut.execute({
      companyId: 'non-existent-company',
      userId: 'non-existent-id',
      roomId: room.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      expect(result.value.message).toBe('User not found.')
    }
  })

  it('should return an error if the room is not found', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userId: user.id.toString(),
      roomId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      expect(result.value.message).toBe('Room not found.')
    }
  })
})
