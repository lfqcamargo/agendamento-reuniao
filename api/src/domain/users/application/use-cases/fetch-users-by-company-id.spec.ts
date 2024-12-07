import { makeUser } from 'test/factories/make-user'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { FetchUsersByCompanyIdUseCase } from './fetch-users-by-company-id'

let inMemoryUserRepository: InMemoryUserRepository
let sut: FetchUsersByCompanyIdUseCase

describe('FetchUsersByCompanyIdUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FetchUsersByCompanyIdUseCase(inMemoryUserRepository)
  })

  it('should be able to fetch users by company ID', async () => {
    const user1 = makeUser()
    const user2 = makeUser({ companyId: user1.companyId })
    const user3 = makeUser()

    await inMemoryUserRepository.create(user1)
    await inMemoryUserRepository.create(user2)
    await inMemoryUserRepository.create(user3)

    const result = await sut.execute({
      userAuthenticateId: user1.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.users).toHaveLength(2)
      expect(result.value.users).toEqual([user1, user2])
    }
  })

  it('should return an error if no users are found for the company ID', async () => {
    const result = await sut.execute({
      userAuthenticateId: 'non-existent-company',
      page: 1,
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      expect(result.value.message).toBe('User not found.')
    }
  })

  it('should paginate the users correctly', async () => {
    const user = makeUser()
    await inMemoryUserRepository.create(user)
    // Create 25 users for the same company
    for (let i = 1; i <= 24; i++) {
      const userCreate = makeUser({ companyId: user.companyId })
      await inMemoryUserRepository.create(userCreate)
    }

    // Page 1 should return the first 20 users
    const resultPage1 = await sut.execute({
      userAuthenticateId: user.id.toString(),
      page: 1,
    })

    expect(resultPage1.isRight()).toBe(true)
    if (resultPage1.isRight()) {
      expect(resultPage1.value.users).toHaveLength(20)
    }

    // Page 2 should return the remaining 5 users
    const resultPage2 = await sut.execute({
      userAuthenticateId: user.id.toString(),
      page: 2,
    })

    expect(resultPage2.isRight()).toBe(true)
    if (resultPage2.isRight()) {
      expect(resultPage2.value.users).toHaveLength(5)
    }
  })
})
