import { Prisma, RoomScheduling as PrismaRoomScheduling } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RoomScheduling } from '@/domain/app/enterprise/entities/room-scheduling'

export class PrismaRoomSchedulingMapper {
  static toDomain(raw: PrismaRoomScheduling): RoomScheduling {
    const roomscheduling = RoomScheduling.create(
      {
        companyId: new UniqueEntityID(raw.companyId),
        creatorId: new UniqueEntityID(raw.creatorId),
        roomId: new UniqueEntityID(raw.roomId),
        startTime: raw.startTime,
        endTime: raw.startTime,
      },
      new UniqueEntityID(raw.id),
    )

    return roomscheduling
  }

  static toPrisma(
    roomscheduling: RoomScheduling,
  ): Prisma.RoomSchedulingUncheckedCreateInput {
    return {
      id: roomscheduling.id.toString(),
      companyId: roomscheduling.companyId.toString(),
      creatorId: roomscheduling.creatorId.toString(),
      roomId: roomscheduling.roomId.toString(),
      startTime: roomscheduling.startTime,
      endTime: roomscheduling.endTime,
    }
  }
}
