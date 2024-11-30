import { makeUser } from 'test/factories/make-user'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SystemDoesNotAllowError } from '@/core/errors/system-does-not-allow'
import { UserNotAdminError } from '@/core/errors/user-not-admin'
import { UserNotCompanyError } from '@/core/errors/user-not-company'

import { DeleteUserUseCase } from './delete-user'

let inMemoryUserRepository: InMemoryUserRepository
let sut: DeleteUserUseCase

describe('DeleteUserUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new DeleteUserUseCase(inMemoryUserRepository)
  })

  it('should be able to delete a user if admin', async () => {
    const adminUser = makeUser({ role: 1 })
    const userToDelete = makeUser({ companyId: adminUser.companyId })

    await inMemoryUserRepository.create(adminUser)
    await inMemoryUserRepository.create(userToDelete)

    const result = await sut.execute({
      adminId: adminUser.id.toString(),
      userId: userToDelete.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items.length).toBe(1)
    expect(inMemoryUserRepository.items[0].id).toEqual(adminUser.id)
  })

  it('should not delete a user if admin does not exist', async () => {
    const result = await sut.execute({
      adminId: 'non-existent-admin',
      userId: 'non-existent-user',
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not delete a user if admin is not an administrator', async () => {
    const nonAdminUser = makeUser({ role: 2 })
    const userToDelete = makeUser({ companyId: nonAdminUser.companyId })

    await inMemoryUserRepository.create(nonAdminUser)
    await inMemoryUserRepository.create(userToDelete)

    const result = await sut.execute({
      adminId: nonAdminUser.id.toString(),
      userId: userToDelete.id.toString(),
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UserNotAdminError)
  })

  it('should not delete a user if user does not exist', async () => {
    const adminUser = makeUser({ role: 1 })

    await inMemoryUserRepository.create(adminUser)

    const result = await sut.execute({
      adminId: adminUser.id.toString(),
      userId: 'non-existent-user',
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not delete a user if admin tries to delete themselves', async () => {
    const adminUser = makeUser({ role: 1 })

    await inMemoryUserRepository.create(adminUser)

    const result = await sut.execute({
      adminId: adminUser.id.toString(),
      userId: adminUser.id.toString(),
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(SystemDoesNotAllowError)
  })

  it('should not delete a user if they belong to a different company', async () => {
    const adminUser = makeUser({ role: 1 })
    const userToDelete = makeUser()

    await inMemoryUserRepository.create(adminUser)
    await inMemoryUserRepository.create(userToDelete)

    const result = await sut.execute({
      adminId: adminUser.id.toString(),
      userId: userToDelete.id.toString(),
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UserNotCompanyError)
  })
})
