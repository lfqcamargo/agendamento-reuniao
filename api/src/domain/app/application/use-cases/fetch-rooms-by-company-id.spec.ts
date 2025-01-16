import { makeRoom } from 'test/factories/make-room'
import { makeUser } from 'test/factories/make-user'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { FetchRoomsByCompanyIdUseCase } from './fetch-rooms-by-company-id'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRoomsRepository: InMemoryRoomsRepository
let sut: FetchRoomsByCompanyIdUseCase

describe('FetchRoomsByCompanyIdUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRoomsRepository = new InMemoryRoomsRepository()
    sut = new FetchRoomsByCompanyIdUseCase(inMemoryRoomsRepository)
  })

  it('should fetch rooms by company ID', async () => {
    const user = makeUser()
    const room1 = makeRoom({ companyId: user.companyId })
    const room2 = makeRoom({ companyId: user.companyId })
    const room3 = makeRoom()

    await inMemoryUsersRepository.create(user)
    await inMemoryRoomsRepository.create(room1)
    await inMemoryRoomsRepository.create(room2)
    await inMemoryRoomsRepository.create(room3)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      page: 1,
      itemsPerPage: 20,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.rooms).toHaveLength(2)
      expect(result.value.rooms).toEqual([room1, room2])
    }
  })

  it('should return an error if no rooms are found for the company', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      page: 1,
      itemsPerPage: 20,
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
      await inMemoryRoomsRepository.create(room)
    }

    const resultPage1 = await sut.execute({
      companyId: user.companyId.toString(),
      page: 1,
      itemsPerPage: 20,
    })

    expect(resultPage1.isRight()).toBe(true)
    if (resultPage1.isRight()) {
      const { rooms, meta } = resultPage1.value
      expect(rooms).toHaveLength(20)
      expect(meta).toEqual({
        totalItems: 25,
        itemCount: 20,
        itemsPerPage: 20,
        totalPages: 2,
        currentPage: 1,
      })
    }

    const resultPage2 = await sut.execute({
      companyId: user.companyId.toString(),
      page: 2,
      itemsPerPage: 20,
    })

    expect(resultPage2.isRight()).toBe(true)
    if (resultPage2.isRight()) {
      const { rooms, meta } = resultPage2.value
      expect(rooms).toHaveLength(5)
      expect(meta).toEqual({
        totalItems: 25,
        itemCount: 5,
        itemsPerPage: 20,
        totalPages: 2,
        currentPage: 2,
      })
    }
  })
})
