import { makeUser } from 'test/factories/make-user'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { FindUserByIdUseCase } from './find-user-by-id'

let inMemoryUserRepository: InMemoryUserRepository
let sut: FindUserByIdUseCase

describe('FindUserByIdUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new FindUserByIdUseCase(inMemoryUserRepository)
  })

  it('should be able to find a user by id', async () => {
    const user = makeUser()
    await inMemoryUserRepository.create(user)

    const result = await sut.execute({
      userAuthenticateId: user.id.toString(),
      id: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user).toEqual(user)
    }
  })

  it('should return an error if the user is not found', async () => {
    const result = await sut.execute({
      userAuthenticateId: 'non-existent-id',
      id: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
      expect(result.value.message).toBe('User not found.')
    }
  })
})
