import { makeMeeting } from 'test/factories/make-meetings'
import { makeUser } from 'test/factories/make-user'
import { InMemoryMeetingsRepository } from 'test/repositories/in-memory-meetings-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'

import { DeleteMeetingUseCase } from './delete-meeting'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryMeetingsRepository: InMemoryMeetingsRepository
let sut: DeleteMeetingUseCase

describe('DeleteMeetingUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryMeetingsRepository = new InMemoryMeetingsRepository()
    sut = new DeleteMeetingUseCase(
      inMemoryUsersRepository,
      inMemoryMeetingsRepository,
    )
  })

  it('should be able to delete a meeting if admin', async () => {
    const user = makeUser({ role: 1 })
    const meetingToDelete = makeMeeting({
      companyId: user.companyId,
      creatorId: user.id,
    })

    await inMemoryUsersRepository.create(user)
    await inMemoryMeetingsRepository.create(meetingToDelete)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userId: user.id.toString(),
      meetingId: meetingToDelete.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryMeetingsRepository.items.length).toBe(0)
  })

  it('should not delete a meeting if user does not exist', async () => {
    const result = await sut.execute({
      companyId: 'non-existent-company',
      userId: 'non-existent-user',
      meetingId: 'non-existent-meeting',
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not delete a meeting if user is not an administrator', async () => {
    const creator = makeUser()
    const nonAdminUser = makeUser({ companyId: creator.companyId, role: 2 })
    const meetingToDelete = makeMeeting({
      companyId: nonAdminUser.companyId,
      creatorId: creator.id,
    })

    await inMemoryUsersRepository.create(creator)
    await inMemoryUsersRepository.create(nonAdminUser)
    await inMemoryMeetingsRepository.create(meetingToDelete)

    const result = await sut.execute({
      companyId: nonAdminUser.companyId.toString(),
      userId: nonAdminUser.id.toString(),
      meetingId: meetingToDelete.id.toString(),
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(UserNotAdminError)
  })

  it('should not delete a meeting if meeting does not exist', async () => {
    const user = makeUser({ role: 1 })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      companyId: user.companyId.toString(),
      userId: user.id.toString(),
      meetingId: 'non-existent-meeting',
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
