import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Room, RoomProps } from '@/domain/app/enterprise/entities/room'
import { PrismaRoomMapper } from '@/infra/database/prisma/mappers/prisma-room-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

export function makeRoom(
  override: Partial<RoomProps> = {},
  id?: UniqueEntityID,
) {
  const room = Room.create(
    {
      companyId: new UniqueEntityID(faker.string.uuid()),
      name: faker.person.fullName(),
      active: faker.datatype.boolean(),
      ...override,
    },
    id,
  )

  return room
}

@Injectable()
export class RoomFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRoom(data: Partial<RoomProps> = {}): Promise<Room> {
    const room = makeRoom(data)

    await this.prisma.room.create({
      data: PrismaRoomMapper.toPrisma(room),
    })

    return room
  }
}
