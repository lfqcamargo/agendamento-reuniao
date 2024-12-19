import {
  MeetingParticipant as PrismaMeetingParticipant,
  Prisma,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { MeetingParticipant } from '@/domain/app/enterprise/entities/meeting-participant'

export class PrismaMeetingParticipantMapper {
  static toDomain(raw: PrismaMeetingParticipant): MeetingParticipant {
    const meetingparticipant = MeetingParticipant.create(
      {
        companyId: new UniqueEntityID(raw.companyId),
        participantId: new UniqueEntityID(raw.participantId),
        roomSchedulingId: new UniqueEntityID(raw.roomSchedulingId),
      },
      new UniqueEntityID(raw.id),
    )

    return meetingparticipant
  }

  static toPrisma(
    meetingparticipant: MeetingParticipant,
  ): Prisma.MeetingParticipantUncheckedCreateInput {
    return {
      id: meetingparticipant.id.toString(),
      companyId: meetingparticipant.companyId.toString(),
      participantId: meetingparticipant.participantId.toString(),
      roomSchedulingId: meetingparticipant.roomSchedulingId.toString(),
    }
  }
}
