import { makeUser } from 'test/factories/make-user'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { GetProfileUseCase } from './get-profile'

let inMemoryUserRepository: InMemoryUserRepository
let sut: GetProfileUseCase

describe('GetProfileUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new GetProfileUseCase(inMemoryUserRepository)
  })

  it('should be able to get the profile of an existing user', async () => {
    const user = makeUser()
    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userAuthenticateId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user).toEqual(user)
    }
  })

  it('should return an error if the user does not exist', async () => {
    const result = await sut.execute({
      userAuthenticateId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      expect(result.value.message).toBe('User not found.')
    }
  })
})
