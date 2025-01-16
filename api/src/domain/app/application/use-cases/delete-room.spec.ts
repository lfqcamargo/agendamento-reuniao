import { makeRoom } from 'test/factories/make-room'
import { makeUser } from 'test/factories/make-user'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'

import { DeleteRoomUseCase } from './delete-room'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryRoomsRepository: InMemoryRoomsRepository
let sut: DeleteRoomUseCase

describe('DeleteRoomUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryRoomsRepository = new InMemoryRoomsRepository()
    sut = new DeleteRoomUseCase(
      inMemoryUsersRepository,
      inMemoryRoomsRepository,
    )
  })

  it('should be able to delete a room if admin', async () => {
    const user = makeUser({ role: 1 })
    const roomToDelete = makeRoom({ companyId: user.companyId })

    await inMemoryUsersRepository.create(user)
    await inMemoryRoomsRepository.create(roomToDelete)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userId: user.id.toString(),
      roomId: roomToDelete.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRoomsRepository.items.length).toBe(0)
  })

  it('should not delete a room if admin does not exist', async () => {
    const result = await sut.execute({
      companyId: 'non-existent-company',
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
    await inMemoryRoomsRepository.create(roomToDelete)

    const result = await sut.execute({
      companyId: nonAdminUser.companyId.toString(),
      userId: nonAdminUser.id.toString(),
      roomId: roomToDelete.id.toString(),
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UserNotAdminError)
  })

  it('should not delete a room if room does not exist', async () => {
    const user = makeUser({ role: 1 })
    const adminRoom = makeRoom()

    await inMemoryRoomsRepository.create(adminRoom)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userId: user.id.toString(),
      roomId: 'non-existent-room',
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
