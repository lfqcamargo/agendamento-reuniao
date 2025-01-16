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
        meetingId: new UniqueEntityID(raw.meetingId),
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
      meetingId: meetingparticipant.meetingId.toString(),
    }
  }

  static toPrismaCreateMany(
    meetingParticipants: MeetingParticipant[],
  ): Prisma.MeetingParticipantCreateManyArgs {
    const data = meetingParticipants.map((participant) => ({
      id: participant.id.toString(),
      companyId: participant.companyId.toString(),
      participantId: participant.participantId.toString(),
      meetingId: participant.meetingId.toString(),
    }))

    return {
      data,
      skipDuplicates: true,
    }
  }
}
