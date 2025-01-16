import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { MeetingParticipant } from '@/domain/app/enterprise/entities/meeting-participant'
import { PrismaMeetingParticipantMapper } from '@/infra/database/prisma/mappers/prisma-meeting-participant-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

export function makeMeetingParticipant(
  override: Partial<MeetingParticipant> = {},
  id?: UniqueEntityID,
): MeetingParticipant {
  const meetingParticipant = MeetingParticipant.create(
    {
      companyId: override.companyId || new UniqueEntityID(faker.string.uuid()),
      participantId:
        override.participantId || new UniqueEntityID(faker.string.uuid()),
      meetingId: override.meetingId || new UniqueEntityID(faker.string.uuid()),
    },
    id,
  )

  return meetingParticipant
}

@Injectable()
export class MeetingParticipantFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaMeetingParticipant(
    data: Partial<MeetingParticipant> = {},
  ): Promise<MeetingParticipant> {
    const meetingParticipant = makeMeetingParticipant(data)

    await this.prisma.meetingParticipant.create({
      data: PrismaMeetingParticipantMapper.toPrisma(meetingParticipant),
    })

    return meetingParticipant
  }
}
