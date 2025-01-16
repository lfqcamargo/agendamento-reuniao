import { Meeting as PrismaMeeting, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Meeting } from '@/domain/app/enterprise/entities/meeting'

export class PrismaMeetingMapper {
  static toDomain(raw: PrismaMeeting): Meeting {
    const meeting = Meeting.create(
      {
        companyId: new UniqueEntityID(raw.companyId),
        creatorId: new UniqueEntityID(raw.creatorId),
        roomId: new UniqueEntityID(raw.roomId),
        startTime: raw.startTime,
        endTime: raw.startTime,
      },
      new UniqueEntityID(raw.id),
    )

    return meeting
  }

  static toPrisma(meeting: Meeting): Prisma.MeetingUncheckedCreateInput {
    return {
      id: meeting.id.toString(),
      companyId: meeting.companyId.toString(),
      creatorId: meeting.creatorId.toString(),
      roomId: meeting.roomId.toString(),
      startTime: meeting.startTime,
      endTime: meeting.endTime,
    }
  }
}
