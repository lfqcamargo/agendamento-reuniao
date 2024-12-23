import { makeRoom } from 'test/factories/make-room'
import { makeUser } from 'test/factories/make-user'
import { InMemoryRoomsRepository } from 'test/repositories/in-memory-rooms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'

import { CreateRoomUseCase } from './create-room'

let inMemoryRoomsRepository: InMemoryRoomsRepository
let inMemoryUsersRepository: InMemoryUsersRepository

let sut: CreateRoomUseCase

describe('CreateRoomUseCase', () => {
  beforeEach(() => {
    inMemoryRoomsRepository = new InMemoryRoomsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new CreateRoomUseCase(
      inMemoryRoomsRepository,
      inMemoryUsersRepository,
    )
  })

  it('should be able to create a new room', async () => {
    const userAdmin = makeUser({ role: 1 })
    const room = makeRoom({ companyId: userAdmin.companyId })
    inMemoryUsersRepository.items.push(userAdmin)

    const result = await sut.execute({
      companyId: userAdmin.companyId.toString(),
      userId: userAdmin.id.toString(),
      name: room.name,
      active: room.active,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRoomsRepository.items.length).toBe(1)
    expect(inMemoryRoomsRepository.items[0].companyId).toEqual(room.companyId)
    expect(inMemoryRoomsRepository.items[0].name).toEqual(room.name)
    expect(inMemoryRoomsRepository.items[0].active).toEqual(room.active)
  })

  it('It should not be possible to create a room with the same name in the same company', async () => {
    const userAdmin = makeUser({ role: 1 })
    const roomExists = makeRoom({ companyId: userAdmin.companyId })
    const room = makeRoom({
      companyId: userAdmin.companyId,
      name: roomExists.name,
    })
    inMemoryUsersRepository.items.push(userAdmin)
    inMemoryRoomsRepository.items.push(roomExists)

    const result = await sut.execute({
      companyId: userAdmin.companyId.toString(),
      userId: userAdmin.id.toString(),
      name: room.name,
      active: room.active,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })

  it('It should not be possible to create a room without an admin user', async () => {
    const userAdmin = makeUser({ role: 2 })
    const room = makeRoom({
      companyId: userAdmin.companyId,
    })
    inMemoryUsersRepository.items.push(userAdmin)

    const result = await sut.execute({
      companyId: userAdmin.companyId.toString(),
      userId: userAdmin.id.toString(),
      name: room.name,
      active: room.active,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNotAdminError)
  })

  it('It should not be possible to create a room without user', async () => {
    const userAdmin = makeUser({ role: 2 })
    const room = makeRoom({
      companyId: userAdmin.companyId,
    })
    inMemoryUsersRepository.items.push(userAdmin)

    const result = await sut.execute({
      companyId: userAdmin.companyId.toString(),
      userId: 'non-exists-user',
      name: room.name,
      active: room.active,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
