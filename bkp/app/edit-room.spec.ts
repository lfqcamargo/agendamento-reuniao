import { makeRoom } from 'test/factories/make-room'
import { makeUser } from 'test/factories/make-user'
import { InMemoryRoomRepository } from 'test/repositories/in-memory-room-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-user-repository'

import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin'

import { EditRoomUseCase } from './edit-room'

let inMemoryRoomRepository: InMemoryRoomRepository
let inMemoryUsersRepository: InMemoryUsersRepository

let sut: EditRoomUseCase

describe('EditRoomUseCase', () => {
  beforeEach(() => {
    inMemoryRoomRepository = new InMemoryRoomRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new EditRoomUseCase(inMemoryRoomRepository, inMemoryUsersRepository)
  })

  it('should be able to edit a new room', async () => {
    const userAdmin = makeUser({ role: 1 })
    const room = makeRoom({ companyId: userAdmin.companyId })
    inMemoryUsersRepository.items.push(userAdmin)
    inMemoryRoomRepository.items.push(room)

    const result = await sut.execute({
      userId: userAdmin.id.toString(),
      roomId: room.id.toString(),
      name: 'Room 1',
      active: false,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRoomRepository.items.length).toBe(1)
    expect(inMemoryRoomRepository.items[0].name).toEqual('Room 1')
  })

  it('It should not be possible to edit a room with the same name in the same company', async () => {
    const userAdmin = makeUser({ role: 1 })
    const roomExists = makeRoom({ companyId: userAdmin.companyId })
    const room = makeRoom({ companyId: userAdmin.companyId })
    inMemoryUsersRepository.items.push(userAdmin)
    inMemoryRoomRepository.items.push(roomExists)
    inMemoryRoomRepository.items.push(room)

    const result = await sut.execute({
      userId: userAdmin.id.toString(),
      roomId: room.id.toString(),
      name: roomExists.name,
      active: room.active,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })

  it('It should not be possible to edit a room without an admin user', async () => {
    const userAdmin = makeUser({ role: 2 })
    const room = makeRoom({
      companyId: userAdmin.companyId,
    })
    inMemoryUsersRepository.items.push(userAdmin)
    inMemoryRoomRepository.items.push(room)

    const result = await sut.execute({
      userId: userAdmin.id.toString(),
      roomId: room.id.toString(),
      name: room.name,
      active: room.active,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNotAdminError)
  })
})
