import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SystemDoesNotAllowError } from '@/core/errors/system-does-not-allow'

import { EditUserUseCase } from './edit-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: EditUserUseCase

describe('EditUserUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    sut = new EditUserUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should be able to edit a user admin', async () => {
    const userAdmin = makeUser({ role: 1 })
    const editUser = makeUser({
      companyId: userAdmin.companyId,
      role: 1,
    })
    await inMemoryUsersRepository.create(userAdmin)
    await inMemoryUsersRepository.create(editUser)

    const result = await sut.execute({
      companyId: userAdmin.companyId.toString(),
      userAuthenticateId: userAdmin.id.toString(),
      userId: editUser.id.toString(),
      name: 'Lucas Camargo',
      nickname: 'lfqcamargo',
      password: '123456',
      role: 2,
    })

    const passwordHashed = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[1].name).toEqual('Lucas Camargo')
    expect(inMemoryUsersRepository.items[1].password).toEqual(passwordHashed)
    expect(inMemoryUsersRepository.items[1].role).toEqual(2)
  })

  it('should be able to edit a user self', async () => {
    const user = makeUser({
      role: 2,
    })
    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userAuthenticateId: user.id.toString(),
      userId: user.id.toString(),
      name: 'Lucas Camargo',
      nickname: 'lfqcamargo',
      password: '123456',
    })

    const passwordHashed = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].name).toEqual('Lucas Camargo')
    expect(inMemoryUsersRepository.items[0].password).toEqual(passwordHashed)
  })

  it('It should not be possible to use the same nickname for the same company', async () => {
    const userAdmin = makeUser({
      companyId: new UniqueEntityID(),
      nickname: 'lfqcamargo',
      role: 1,
    })
    const user = makeUser({
      companyId: userAdmin.companyId,
      nickname: 'lfqcamargo',
    })
    await inMemoryUsersRepository.create(userAdmin)
    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      companyId: userAdmin.companyId.toString(),
      userAuthenticateId: userAdmin.id.toString(),
      userId: user.id.toString(),
      nickname: 'lfqcamargo',
    })

    expect(result.isRight()).toBe(false)
    expect(inMemoryUsersRepository.items[0].nickname).toEqual('lfqcamargo')
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })

  it('It should be possible to use the same nickname for the other company', async () => {
    const userAdmin = makeUser({ nickname: 'lfqcamargo', role: 1 })
    const user = makeUser()
    await inMemoryUsersRepository.create(userAdmin)
    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userAuthenticateId: user.id.toString(),
      userId: user.id.toString(),
      nickname: 'lfqcamargo',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].nickname).toEqual('lfqcamargo')
  })

  it('It should not be possible to leave the company without an administrator user', async () => {
    const user = makeUser({ role: 1 })
    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userAuthenticateId: user.id.toString(),
      userId: user.id.toString(),
      role: 2,
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(SystemDoesNotAllowError)
  })

  it('It should not be possible to edit a non-existent user', async () => {
    const user = makeUser({ role: 1 })
    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userAuthenticateId: user.id.toString(),
      userId: new UniqueEntityID().toString(),
      role: 2,
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('It should not be possible to edit with a non-existent administrator', async () => {
    const user = makeUser({ role: 1 })
    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      companyId: new UniqueEntityID().toString(),
      userAuthenticateId: user.id.toString(),
      userId: user.companyId.toString(),
      role: 2,
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('The role should not be edited by a member', async () => {
    const user = makeUser({ role: 2 })
    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userAuthenticateId: user.id.toString(),
      userId: user.id.toString(),
      role: 1,
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(SystemDoesNotAllowError)
  })

  it('The inactivity should not be edited by a member', async () => {
    const user = makeUser({ role: 2 })
    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userAuthenticateId: user.id.toString(),
      userId: user.id.toString(),
      active: false,
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(SystemDoesNotAllowError)
  })
})
