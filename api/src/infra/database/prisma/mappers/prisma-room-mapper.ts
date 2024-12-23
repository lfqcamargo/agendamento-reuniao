import { Prisma, Room as PrismaRoom } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Room } from '@/domain/app/enterprise/entities/room'

export class PrismaRoomMapper {
  static toDomain(raw: PrismaRoom): Room {
    const room = Room.create(
      {
        companyId: new UniqueEntityID(raw.companyId),
        name: raw.name,
        active: raw.active,
      },
      new UniqueEntityID(raw.id),
    )

    return room
  }

  static toPrisma(room: Room): Prisma.RoomUncheckedCreateInput {
    return {
      companyId: room.companyId.toString(),
      id: room.id.toString(),
      name: room.name,
      active: room.active,
    }
  }
}
