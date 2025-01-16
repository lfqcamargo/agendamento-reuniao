import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeCompany } from 'test/factories/make-company'
import { makeUser } from 'test/factories/make-user'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { CreateCompanyAndUserUseCase } from './create-company-and-user'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: CreateCompanyAndUserUseCase

describe('CreateCompanyAndUserUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateCompanyAndUserUseCase(
      inMemoryCompaniesRepository,
      inMemoryUsersRepository,
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
      name: user.name,
      nickname: user.name,
      password: user.password,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCompaniesRepository.items.length).toBe(1)
    expect(inMemoryCompaniesRepository.items[0].cnpj).toEqual(company.cnpj)
    expect(inMemoryCompaniesRepository.items[0].name).toEqual(company.name)

    expect(inMemoryCompaniesRepository.items[0].users[0]).toMatchObject({
      _id: expect.any(UniqueEntityID),
      props: {
        active: true,
        companyId: expect.any(UniqueEntityID),
        email: expect.any(String),
        name: expect.any(String),
        nickname: expect.any(String),
        password: expect.any(String),
        role: 1,
      },
    })
  })
})
