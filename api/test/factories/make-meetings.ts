import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Meeting, MeetingProps } from '@/domain/app/enterprise/entities/meeting'
import { MeetingParticipant } from '@/domain/app/enterprise/entities/meeting-participant'
import { MeetingParticipantsList } from '@/domain/app/enterprise/entities/meeting-participants-list'
import { PrismaMeetingMapper } from '@/infra/database/prisma/mappers/prisma-meeting-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

export function makeMeeting(
  override: Partial<MeetingProps> = {},
  id?: UniqueEntityID,
) {
  const participants = [
    MeetingParticipant.create({
      companyId: new UniqueEntityID(faker.string.uuid()),
      participantId: new UniqueEntityID(faker.string.uuid()),
      meetingId: id || new UniqueEntityID(faker.string.uuid()),
    }),
    MeetingParticipant.create({
      companyId: new UniqueEntityID(faker.string.uuid()),
      participantId: new UniqueEntityID(faker.string.uuid()),
      meetingId: id || new UniqueEntityID(faker.string.uuid()),
    }),
  ]

  const participantsList = new MeetingParticipantsList(participants)

  const meeting = Meeting.create(
    {
      creatorId: new UniqueEntityID(faker.string.uuid()),
      companyId: new UniqueEntityID(faker.string.uuid()),
      roomId: new UniqueEntityID(faker.string.uuid()),
      startTime: faker.date.future(),
      endTime: faker.date.future(),
      participantsIds: participantsList,
      ...override,
    },
    id,
  )

  return meeting
}

@Injectable()
export class MeetingFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaMeeting(data: Partial<MeetingProps> = {}): Promise<Meeting> {
    const meeting = makeMeeting(data)

    await this.prisma.meeting.create({
      data: PrismaMeetingMapper.toPrisma(meeting),
    })

    return meeting
  }
}
