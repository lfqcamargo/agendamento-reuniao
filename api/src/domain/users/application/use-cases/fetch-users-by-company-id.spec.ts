import { makeCompany } from 'test/factories/make-company'
import { makeUser } from 'test/factories/make-user'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { FetchUsersByCompanyIdUseCase } from './fetch-users-by-company-id'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let sut: FetchUsersByCompanyIdUseCase

describe('FetchUsersByCompanyIdUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    sut = new FetchUsersByCompanyIdUseCase(
      inMemoryCompaniesRepository,
      inMemoryUsersRepository,
    )
  })

  it('should be able to fetch users by company ID', async () => {
    const company = makeCompany()
    const user1 = makeUser({ companyId: company.id })
    const user2 = makeUser({ companyId: company.id })
    const user3 = makeUser()

    await inMemoryCompaniesRepository.create(company)
    await inMemoryUsersRepository.create(user1)
    await inMemoryUsersRepository.create(user2)
    await inMemoryUsersRepository.create(user3)

    const result = await sut.execute({
      companyId: user1.companyId.toString(),
      page: 1,
      itemsPerPage: 20,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.users).toHaveLength(2)
      expect(result.value.users).toEqual([user1, user2])
    }
  })

  it('should return an error if no company', async () => {
    const result = await sut.execute({
      companyId: 'non-existent-company',
      page: 1,
      itemsPerPage: 20,
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      expect(result.value.message).toBe('Company not found.')
    }
  })

  it('should return an error if no users are found for the company ID', async () => {
    const company = makeCompany()
    await inMemoryCompaniesRepository.create(company)

    const result = await sut.execute({
      companyId: company.id.toString(),
      page: 1,
      itemsPerPage: 20,
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      expect(result.value.message).toBe('Users not found.')
    }
  })

  it('should paginate the users correctly', async () => {
    const company = makeCompany()
    const user = makeUser({ companyId: company.id })
    await inMemoryCompaniesRepository.create(company)
    await inMemoryUsersRepository.create(user)

    for (let i = 1; i <= 24; i++) {
      const userCreate = makeUser({ companyId: user.companyId })
      await inMemoryUsersRepository.create(userCreate)
    }

    const resultPage1 = await sut.execute({
      companyId: user.companyId.toString(),
      page: 1,
      itemsPerPage: 20,
    })

    expect(resultPage1.isRight()).toBe(true)
    if (resultPage1.isRight()) {
      const { users, meta } = resultPage1.value
      expect(users).toHaveLength(20)
      expect(meta).toEqual({
        totalItems: 25,
        itemCount: 20,
        itemsPerPage: 20,
        totalPages: 2,
        currentPage: 1,
      })
    }

    const resultPage2 = await sut.execute({
      companyId: user.companyId.toString(),
      page: 2,
      itemsPerPage: 20,
    })

    expect(resultPage2.isRight()).toBe(true)
    if (resultPage2.isRight()) {
      const { users, meta } = resultPage2.value
      expect(users).toHaveLength(5)
      expect(meta).toEqual({
        totalItems: 25,
        itemCount: 5,
        itemsPerPage: 20,
        totalPages: 2,
        currentPage: 2,
      })
    }
  })
})
