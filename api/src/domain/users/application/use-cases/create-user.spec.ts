import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeCompany } from 'test/factories/make-company'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'

import { CreateUserUseCase } from './create-user'
import { AlreadyExistsEmailError } from './errors/already-exists-email-error'
import { AlreadyExistsNicknameError } from './errors/already-exists-nickname-error'
import { InvalidRoleError } from './errors/invalid-role-error'

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
    const userAdmin = makeUser({ role: 1 })
    const user = makeUser({ companyId: userAdmin.companyId })
    inMemoryUserRepository.items.push(userAdmin)

    const result = await sut.execute({
      userAuthenticateId: userAdmin.id.toString(),
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      password: user.password,
      role: user.role,
    })

    const passwordHashed = await fakeHasher.hash(user.password)

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items.length).toBe(2)
    expect(inMemoryUserRepository.items[1].email).toEqual(user.email)
    expect(inMemoryUserRepository.items[1].name).toEqual(user.name)
    expect(inMemoryUserRepository.items[1].password).toEqual(passwordHashed)
    expect(inMemoryUserRepository.items[1].role).toEqual(user.role)
  })

  it('should not be able to create a new user with an existing email', async () => {
    const user = makeUser()
    inMemoryUserRepository.items.push(user)

    const result = await sut.execute({
      userAuthenticateId: user.id.toString(),
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      password: user.password,
      role: user.role,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsEmailError)
  })

  it('it should not be possible to create a new user with an existing nickname in the same company', async () => {
    const company = makeCompany()
    const user = makeUser({ companyId: company.id })
    inMemoryUserRepository.items.push(user)

    const result = await sut.execute({
      userAuthenticateId: user.id.toString(),
      email: 'lfqcamargo@gmail.com',
      name: user.name,
      nickname: user.nickname,
      password: user.password,
      role: user.role,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsNicknameError)
  })

  it('should not allow creating a user with an invalid role', async () => {
    const result = await sut.execute({
      userAuthenticateId: 'company-id',
      email: 'test@example.com',
      name: 'Test User',
      nickname: 'testuser',
      password: 'password123',
      role: 99,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidRoleError)
  })
})
