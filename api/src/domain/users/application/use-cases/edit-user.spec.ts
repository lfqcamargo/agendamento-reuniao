import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { EditUserUseCase } from './edit-user'
import { AlreadyExistsNicknameError } from './errors/already-exists-nickname-error'
import { InvalidRoleError } from './errors/invalid-role-error'
import { MissingAdminError } from './errors/missing-admin'

let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let sut: EditUserUseCase

describe('EditUserUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    sut = new EditUserUseCase(inMemoryUserRepository, fakeHasher)
  })

  it('should be able to edit a user', async () => {
    const userFixed = makeUser({ role: 1 })
    const user = makeUser({
      companyId: userFixed.companyId,
      role: 1,
    })
    await inMemoryUserRepository.create(userFixed)
    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userAuthenticateId: userFixed.id.toString(),
      id: user.id.toString(),
      name: 'Lucas Camargo',
      nickname: 'lfqcamargo',
      password: '123456',
      role: 2,
    })

    const passwordHashed = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[1].name).toEqual('Lucas Camargo')
    expect(inMemoryUserRepository.items[1].password).toEqual(passwordHashed)
    expect(inMemoryUserRepository.items[1].role).toEqual(2)
  })

  it('It should not be possible to use the same nickname for the same company', async () => {
    const userFixed = makeUser({
      companyId: new UniqueEntityID(),
      nickname: 'lfqcamargo',
      role: 1,
    })
    const user = makeUser({
      companyId: userFixed.companyId,
      nickname: 'lfqcamargo',
    })
    await inMemoryUserRepository.create(userFixed)
    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userAuthenticateId: userFixed.id.toString(),
      id: user.id.toString(),
      nickname: 'lfqcamargo',
    })

    expect(result.isRight()).toBe(false)
    expect(inMemoryUserRepository.items[0].nickname).toEqual('lfqcamargo')
    expect(result.value).toBeInstanceOf(AlreadyExistsNicknameError)
  })

  it('It should be possible to use the same nickname for the other company', async () => {
    const userFixed = makeUser({ nickname: 'lfqcamargo', role: 1 })
    const user = makeUser()
    await inMemoryUserRepository.create(userFixed)
    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userAuthenticateId: user.id.toString(),
      id: user.id.toString(),
      nickname: 'lfqcamargo',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[0].nickname).toEqual('lfqcamargo')
  })

  it('It should not be possible to leave the company without an administrator user', async () => {
    const user = makeUser({ role: 1 })
    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userAuthenticateId: user.id.toString(),
      id: user.id.toString(),
      role: 2,
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(MissingAdminError)
  })

  it('It should not be possible to place a role that is not configured', async () => {
    const userFixed = makeUser({ companyId: new UniqueEntityID(), role: 1 })
    const user = makeUser({ companyId: userFixed.companyId, role: 1 })
    await inMemoryUserRepository.create(userFixed)
    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userAuthenticateId: userFixed.id.toString(),
      id: user.id.toString(),
      role: 3,
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(InvalidRoleError)
  })
})
