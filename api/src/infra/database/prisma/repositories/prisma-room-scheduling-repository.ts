import { Injectable } from '@nestjs/common'

import { RoomSchedulingsRepository } from '@/domain/app/application/repositories/room-schedulings-repository'
import { RoomScheduling } from '@/domain/app/enterprise/entities/room-scheduling'

import { PrismaRoomSchedulingMapper } from '../mappers/prisma-room-scheduling-mapper'
import { PrismaService } from '../prisma-service'

@Injectable()
export class PrismaRoomSchedulingRepository
  implements RoomSchedulingsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(roomscheduling: RoomScheduling): Promise<void> {
    const data = PrismaRoomSchedulingMapper.toPrisma(roomscheduling)

    await this.prisma.roomScheduling.create({
      data,
    })
  }

  async findById(id: string): Promise<RoomScheduling | null> {
    const roomscheduling = await this.prisma.roomScheduling.findUnique({
      where: {
        id,
      },
    })

    if (!roomscheduling) {
      return null
    }

    return PrismaRoomSchedulingMapper.toDomain(roomscheduling)
  }

  async fetchScheduledTimes(
    companyId: string,
    roomId: string,
    startTime: Date | null,
    endTime: Date | null,
  ): Promise<RoomScheduling[] | null> {
    const schedules = await this.prisma.roomScheduling.findMany({
      where: {
        companyId,
        roomId,
        startTime: startTime ? { gte: startTime } : undefined,
        endTime: endTime ? { lte: endTime } : undefined,
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    if (!schedules.length) {
      return null
    }

    return schedules.map(PrismaRoomSchedulingMapper.toDomain)
  }

  async save(roomscheduling: RoomScheduling): Promise<void> {
    const data = PrismaRoomSchedulingMapper.toPrisma(roomscheduling)

    await this.prisma.roomScheduling.update({
      where: {
        id: roomscheduling.id.toString(),
      },
      data,
    })
  }

  async delete(roomscheduling: RoomScheduling): Promise<void> {
    await this.prisma.roomScheduling.delete({
      where: {
        id: roomscheduling.id.toString(),
      },
    })
  }

  async deleteByRoomId(companyId: string, roomId: string): Promise<void> {
    await this.prisma.roomScheduling.deleteMany({
      where: {
        companyId,
        roomId,
      },
    })
  }
}
