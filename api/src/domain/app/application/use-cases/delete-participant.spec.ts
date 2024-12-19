import { makeUser } from 'test/factories/make-user'
import { InMemoryMeetingParticipantsRepository } from 'test/repositories/in-memory-meeting-participants-repository'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SystemDoesNotAllowError } from '@/core/errors/system-does-not-allow'
import { MeetingParticipant } from '@/domain/app/enterprise/entities/meeting-participant'

import { DeleteParticipantUseCase } from './delete-participant'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryMeetingParticipantsRepository: InMemoryMeetingParticipantsRepository
let sut: DeleteParticipantUseCase

describe('DeleteParticipant', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryMeetingParticipantsRepository =
      new InMemoryMeetingParticipantsRepository()

    sut = new DeleteParticipantUseCase(
      inMemoryUserRepository,
      inMemoryMeetingParticipantsRepository,
    )
  })

  it('should delete a participant successfully as admin', async () => {
    const admin = makeUser({ role: 1 })
    const participant = makeUser({ companyId: admin.companyId })

    const meetingParticipant = MeetingParticipant.create({
      companyId: participant.companyId,
      participantId: participant.id,
      roomSchedulingId: new UniqueEntityID(),
    })

    inMemoryUserRepository.items.push(admin, participant)
    inMemoryMeetingParticipantsRepository.items.push(meetingParticipant)

    const result = await sut.execute({
      userAuthenticateId: admin.id.toString(),
      meetingParticipantId: meetingParticipant.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryMeetingParticipantsRepository.items.length).toBe(0)
  })

  it('should delete a participant successfully as the participant', async () => {
    const participant = makeUser()

    const meetingParticipant = MeetingParticipant.create({
      companyId: participant.companyId,
      participantId: participant.id,
      roomSchedulingId: new UniqueEntityID('room-1'),
    })

    inMemoryUserRepository.items.push(participant)
    inMemoryMeetingParticipantsRepository.items.push(meetingParticipant)

    const result = await sut.execute({
      userAuthenticateId: participant.id.toString(),
      meetingParticipantId: meetingParticipant.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryMeetingParticipantsRepository.items.length).toBe(0)
  })

  it('should fail if participant does not exist', async () => {
    const admin = makeUser({ role: 1 })

    inMemoryUserRepository.items.push(admin)

    const result = await sut.execute({
      userAuthenticateId: admin.id.toString(),
      meetingParticipantId: 'non-existent-participant',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should fail if user does not exist', async () => {
    const participant = makeUser()

    const meetingParticipant = MeetingParticipant.create({
      companyId: participant.companyId,
      participantId: participant.id,
      roomSchedulingId: new UniqueEntityID('room-1'),
    })

    inMemoryMeetingParticipantsRepository.items.push(meetingParticipant)

    const result = await sut.execute({
      userAuthenticateId: 'non-existent-user',
      meetingParticipantId: meetingParticipant.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should fail if user is not admin and tries to delete another participant', async () => {
    const user = makeUser({ role: 2 })
    const participant = makeUser()

    const meetingParticipant = MeetingParticipant.create({
      companyId: participant.companyId,
      participantId: participant.id,
      roomSchedulingId: new UniqueEntityID('room-1'),
    })

    inMemoryUserRepository.items.push(user, participant)
    inMemoryMeetingParticipantsRepository.items.push(meetingParticipant)

    const result = await sut.execute({
      userAuthenticateId: user.id.toString(),
      meetingParticipantId: meetingParticipant.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SystemDoesNotAllowError)
  })
})
