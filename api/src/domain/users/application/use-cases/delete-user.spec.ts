import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SystemDoesNotAllowError } from '@/core/errors/system-does-not-allow'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'

import { DeleteUserUseCase } from './delete-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe('DeleteUserUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new DeleteUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to delete a user if admin', async () => {
    const adminUser = makeUser({ role: 1 })
    const userToDelete = makeUser({ companyId: adminUser.companyId })

    await inMemoryUsersRepository.create(adminUser)
    await inMemoryUsersRepository.create(userToDelete)

    const result = await sut.execute({
      companyId: adminUser.companyId.toString(),
      userAuthenticateId: adminUser.id.toString(),
      userId: userToDelete.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items.length).toBe(1)
    expect(inMemoryUsersRepository.items[0].id).toEqual(adminUser.id)
  })

  it('should not delete a user if admin does not exist', async () => {
    const result = await sut.execute({
      companyId: 'non-existent-company',
      userAuthenticateId: 'non-existent-admin',
      userId: 'non-existent-user',
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not delete a user if admin is not an administrator', async () => {
    const nonAdminUser = makeUser({ role: 2 })
    const userToDelete = makeUser({ companyId: nonAdminUser.companyId })

    await inMemoryUsersRepository.create(nonAdminUser)
    await inMemoryUsersRepository.create(userToDelete)

    const result = await sut.execute({
      companyId: nonAdminUser.companyId.toString(),
      userAuthenticateId: nonAdminUser.id.toString(),
      userId: userToDelete.id.toString(),
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UserNotAdminError)
  })

  it('should not delete a user if user does not exist', async () => {
    const adminUser = makeUser({ role: 1 })

    await inMemoryUsersRepository.create(adminUser)

    const result = await sut.execute({
      companyId: adminUser.id.toString(),
      userAuthenticateId: adminUser.id.toString(),
      userId: 'non-existent-user',
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not delete a user if admin tries to delete themselves', async () => {
    const adminUser = makeUser({ role: 1 })

    await inMemoryUsersRepository.create(adminUser)

    const result = await sut.execute({
      companyId: adminUser.companyId.toString(),
      userAuthenticateId: adminUser.id.toString(),
      userId: adminUser.id.toString(),
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(SystemDoesNotAllowError)
  })
})
