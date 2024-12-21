import { makeRoom } from 'test/factories/make-room'
import { makeUser } from 'test/factories/make-user'
import { InMemoryRoomRepository } from 'test/repositories/in-memory-room-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-user-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { FetchRoomsByCompanyIdUseCase } from './fetch-rooms-by-company-id'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRoomRepository: InMemoryRoomRepository
let sut: FetchRoomsByCompanyIdUseCase

describe('FetchRoomsByCompanyIdUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRoomRepository = new InMemoryRoomRepository()
    sut = new FetchRoomsByCompanyIdUseCase(
      inMemoryUsersRepository,
      inMemoryRoomRepository,
    )
  })

  it('should fetch rooms by company ID', async () => {
    const user = makeUser()
    const room1 = makeRoom({ companyId: user.companyId })
    const room2 = makeRoom({ companyId: user.companyId })
    const room3 = makeRoom()

    await inMemoryUsersRepository.create(user)
    await inMemoryRoomRepository.create(room1)
    await inMemoryRoomRepository.create(room2)
    await inMemoryRoomRepository.create(room3)

    const result = await sut.execute({
      userAuthenticateId: user.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.rooms).toHaveLength(2)
      expect(result.value.rooms).toEqual([room1, room2])
    }
  })

  it('should return an error if user is not found', async () => {
    const result = await sut.execute({
      userAuthenticateId: 'non-existent-user',
      page: 1,
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      expect(result.value.message).toBe('User not found.')
    }
  })

  it('should return an error if no rooms are found for the company', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userAuthenticateId: user.id.toString(),
      page: 1,
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      expect(result.value.message).toBe('No rooms found.')
    }
  })

  it('should paginate rooms correctly', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    for (let i = 0; i < 25; i++) {
      const room = makeRoom({ companyId: user.companyId })
      await inMemoryRoomRepository.create(room)
    }

    const resultPage1 = await sut.execute({
      userAuthenticateId: user.id.toString(),
      page: 1,
    })

    expect(resultPage1.isRight()).toBe(true)
    if (resultPage1.isRight()) {
      expect(resultPage1.value.rooms).toHaveLength(20)
    }

    const resultPage2 = await sut.execute({
      userAuthenticateId: user.id.toString(),
      page: 2,
    })

    expect(resultPage2.isRight()).toBe(true)
    if (resultPage2.isRight()) {
      expect(resultPage2.value.rooms).toHaveLength(5)
    }
  })
})
