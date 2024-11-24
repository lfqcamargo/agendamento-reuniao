import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'

import { CreateUserUseCase } from './create-user'
import { AlreadyExistsEmailError } from './errors/already-exists-email-error'

let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let sut: CreateUserUseCase

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateUserUseCase(inMemoryUserRepository, fakeHasher)
  })

  it('should be able to create a new user', async () => {
    const user = makeUser()

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role,
    })

    const passwordHashed = await fakeHasher.hash(user.password)

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items.length).toBe(1)
    expect(inMemoryUserRepository.items[0].email).toEqual(user.email)
    expect(inMemoryUserRepository.items[0].name).toEqual(user.name)
    expect(inMemoryUserRepository.items[0].password).toEqual(passwordHashed)
    expect(inMemoryUserRepository.items[0].role).toEqual(user.role)
  })

  it('should not be able to create a new user with an existing email', async () => {
    const user = makeUser()
    inMemoryUserRepository.items.push(user)

    const result = await sut.execute({
      companyId: user.id.toString(),
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsEmailError)
  })
})
