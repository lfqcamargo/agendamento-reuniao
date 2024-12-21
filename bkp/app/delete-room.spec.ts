import { makeRoom } from 'test/factories/make-room'
import { makeUser } from 'test/factories/make-user'
import { InMemoryRoomRepository } from 'test/repositories/in-memory-room-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-user-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin'
import { UserNotCompanyError } from '@/core/errors/user-not-company'

import { DeleteRoomUseCase } from './delete-room'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRoomRepository: InMemoryRoomRepository
let sut: DeleteRoomUseCase

describe('DeleteRoomUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRoomRepository = new InMemoryRoomRepository()
    sut = new DeleteRoomUseCase(inMemoryUsersRepository, inMemoryRoomRepository)
  })

  it('should be able to delete a room if admin', async () => {
    const user = makeUser({ role: 1 })
    const roomToDelete = makeRoom({ companyId: user.companyId })

    await inMemoryUsersRepository.create(user)
    await inMemoryRoomRepository.create(roomToDelete)

    const result = await sut.execute({
      userId: user.id.toString(),
      roomId: roomToDelete.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRoomRepository.items.length).toBe(0)
  })

  it('should not delete a room if admin does not exist', async () => {
    const result = await sut.execute({
      userId: 'non-existent-admin',
      roomId: 'non-existent-room',
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not delete a room if admin is not an administrator', async () => {
    const nonAdminUser = makeUser({ role: 2 })
    const roomToDelete = makeRoom({ companyId: nonAdminUser.companyId })

    await inMemoryUsersRepository.create(nonAdminUser)
    await inMemoryRoomRepository.create(roomToDelete)

    const result = await sut.execute({
      userId: nonAdminUser.id.toString(),
      roomId: roomToDelete.id.toString(),
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UserNotAdminError)
  })

  it('should not delete a room if room does not exist', async () => {
    const user = makeUser({ role: 1 })
    const adminRoom = makeRoom()

    await inMemoryRoomRepository.create(adminRoom)

    const result = await sut.execute({
      userId: user.id.toString(),
      roomId: 'non-existent-room',
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not delete a room if they belong to a different company', async () => {
    const user = makeUser({ role: 1 })
    const roomToDelete = makeRoom()

    await inMemoryUsersRepository.create(user)
    await inMemoryRoomRepository.create(roomToDelete)

    const result = await sut.execute({
      userId: user.id.toString(),
      roomId: roomToDelete.id.toString(),
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UserNotCompanyError)
  })
})
