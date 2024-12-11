import { makeRoom } from 'test/factories/make-room'
import { makeUser } from 'test/factories/make-user'
import { InMemoryRoomRepository } from 'test/repositories/in-memory-room-repository'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { FindRoomByIdUseCase } from './find-room-by-id'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryRoomRepository: InMemoryRoomRepository
let sut: FindRoomByIdUseCase

describe('FindRoomByIdUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryRoomRepository = new InMemoryRoomRepository()
    sut = new FindRoomByIdUseCase(
      inMemoryUserRepository,
      inMemoryRoomRepository,
    )
  })

  it('should be able to find a room by id', async () => {
    const user = makeUser()
    const room = makeRoom({ companyId: user.companyId })
    await inMemoryUserRepository.create(user)
    await inMemoryRoomRepository.create(room)

    const result = await sut.execute({
      userAuthenticateId: user.id.toString(),
      id: room.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.room).toEqual(room)
    }
  })

  it('should return an error if the user is not found', async () => {
    const room = makeRoom()

    const result = await sut.execute({
      userAuthenticateId: 'non-existent-id',
      id: room.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      expect(result.value.message).toBe('User not found.')
    }
  })

  it('should return an error if the room is not found', async () => {
    const user = makeUser()
    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userAuthenticateId: user.id.toString(),
      id: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      expect(result.value.message).toBe('Room not found.')
    }
  })
})
