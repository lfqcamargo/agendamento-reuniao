import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeCompany } from 'test/factories/make-company'
import { makeUser } from 'test/factories/make-user'
import { InMemoryCompanyRepository } from 'test/repositories/in-memory-company-repository'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'

import { CreateCompanyAndUserUseCase } from './create-company-and-user'
import { AlreadyExistsCnpjError } from './errors/already-exists-cnpj-error'
import { AlreadyExistsEmailError } from './errors/already-exists-email-error'

let inMemoryCompanyRepository: InMemoryCompanyRepository
let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let sut: CreateCompanyAndUserUseCase

describe('CreateCompanyAndUserUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryCompanyRepository = new InMemoryCompanyRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateCompanyAndUserUseCase(
      inMemoryCompanyRepository,
      inMemoryUserRepository,
      fakeHasher,
    )
  })

  it('should be able to create a new company and user', async () => {
    const company = makeCompany()
    const user = makeUser()

    const result = await sut.execute({
      cnpj: company.cnpj,
      companyName: company.name,
      email: user.email,
      userName: user.name,
      password: user.password,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCompanyRepository.items.length).toBe(1)
    expect(inMemoryCompanyRepository.items[0].cnpj).toEqual(company.cnpj)
    expect(inMemoryCompanyRepository.items[0].name).toEqual(company.name)

    expect(inMemoryUserRepository.items.length).toBe(1)
  })

  it('should not be able to create a new company with an existing CNPJ', async () => {
    const company = makeCompany()
    const user = makeUser()
    inMemoryCompanyRepository.items.push(company)

    const result = await sut.execute({
      cnpj: company.cnpj,
      companyName: company.name,
      email: user.email,
      userName: user.name,
      password: user.password,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsCnpjError)

    expect(inMemoryUserRepository.items.length).toBe(0)
  })

  it('should not be able to create a new user with an existing email', async () => {
    const company = makeCompany()
    const user = makeUser()
    inMemoryUserRepository.items.push(user)

    const result = await sut.execute({
      cnpj: company.cnpj,
      companyName: company.name,
      email: user.email,
      userName: user.name,
      password: user.password,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsEmailError)

    expect(inMemoryCompanyRepository.items.length).toBe(0)
  })
})
