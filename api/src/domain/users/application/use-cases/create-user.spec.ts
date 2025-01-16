import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'

import { CreateUserUseCase } from './create-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: CreateUserUseCase

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should be able to create a new user', async () => {
    const userAdmin = makeUser({ role: 1 })
    const user = makeUser({ companyId: userAdmin.companyId })
    inMemoryUsersRepository.items.push(userAdmin)

    const result = await sut.execute({
      companyId: userAdmin.companyId.toString(),
      userAuthenticateId: userAdmin.id.toString(),
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      password: user.password,
      role: user.role,
    })

    const passwordHashed = await fakeHasher.hash(user.password)

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items.length).toBe(2)
    expect(inMemoryUsersRepository.items[1].email).toEqual(user.email)
    expect(inMemoryUsersRepository.items[1].name).toEqual(user.name)
    expect(inMemoryUsersRepository.items[1].password).toEqual(passwordHashed)
    expect(inMemoryUsersRepository.items[1].role).toEqual(user.role)
  })

  it('should not be able to create a new user with an existing email', async () => {
    const user = makeUser({ role: 1 })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userAuthenticateId: user.id.toString(),
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      password: user.password,
      role: user.role,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })

  it('it should not be possible to create a new user with an existing nickname in the same company', async () => {
    const user = makeUser({ role: 1 })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userAuthenticateId: user.id.toString(),
      email: 'lfqcamargo@gmail.com',
      name: user.name,
      nickname: user.nickname,
      password: user.password,
      role: user.role,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })

  it('It shoul not be possible to create a new user if you are not an administrator', async () => {
    const user = makeUser({ role: 2 })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userAuthenticateId: user.id.toString(),
      email: 'lfqcamargo@gmail.com',
      name: user.name,
      nickname: user.nickname,
      password: user.password,
      role: user.role,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNotAdminError)
  })
})
