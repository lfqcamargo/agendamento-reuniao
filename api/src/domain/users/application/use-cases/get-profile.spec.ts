import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { GetProfileUseCase } from './get-profile'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetProfileUseCase

describe('GetProfileUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new GetProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able to get the profile of an existing user', async () => {
    const user = makeUser()
    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userAuthenticateId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user).toEqual(user)
    }
  })

  it('should return an error if the user does not exist', async () => {
    const result = await sut.execute({
      companyId: 'non-existent-company',
      userAuthenticateId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      expect(result.value.message).toBe('User not found.')
    }
  })
})
