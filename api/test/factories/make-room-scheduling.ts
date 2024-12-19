import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { MeetingParticipant } from '@/domain/app/enterprise/entities/meeting-participant'
import { MeetingParticipantsList } from '@/domain/app/enterprise/entities/meeting-participants-list'
import {
  RoomScheduling,
  RoomSchedulingProps,
} from '@/domain/app/enterprise/entities/room-scheduling'
import { PrismaRoomSchedulingMapper } from '@/infra/database/prisma/mappers/prisma-room-scheduling-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

export function makeRoomScheduling(
  override: Partial<RoomSchedulingProps> = {},
  id?: UniqueEntityID,
) {
  const participants = [
    MeetingParticipant.create({
      companyId: new UniqueEntityID(faker.string.uuid()),
      participantId: new UniqueEntityID(faker.string.uuid()),
      roomSchedulingId: id || new UniqueEntityID(faker.string.uuid()),
    }),
    MeetingParticipant.create({
      companyId: new UniqueEntityID(faker.string.uuid()),
      participantId: new UniqueEntityID(faker.string.uuid()),
      roomSchedulingId: id || new UniqueEntityID(faker.string.uuid()),
    }),
  ]

  const participantsList = new MeetingParticipantsList(participants)

  const roomScheduling = RoomScheduling.create(
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

  return roomScheduling
}

@Injectable()
export class RoomSchedulingFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRoomScheduling(
    data: Partial<RoomSchedulingProps> = {},
  ): Promise<RoomScheduling> {
    const roomScheduling = makeRoomScheduling(data)

    await this.prisma.roomScheduling.create({
      data: PrismaRoomSchedulingMapper.toPrisma(roomScheduling),
    })

    return roomScheduling
  }
}
