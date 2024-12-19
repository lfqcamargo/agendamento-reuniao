import { Injectable } from '@nestjs/common'

import { RoomRepository } from '@/domain/app/application/repositories/room-repository'
import { Room } from '@/domain/app/enterprise/entities/room'

import { PrismaRoomMapper } from '../mappers/prisma-room-mapper'
import { PrismaService } from '../prisma-service'

@Injectable()
export class PrismaRoomRepository implements RoomRepository {
  constructor(private prisma: PrismaService) {}

  async create(room: Room): Promise<void> {
    const data = PrismaRoomMapper.toPrisma(room)

    await this.prisma.room.create({
      data,
    })
  }

  async findById(id: string): Promise<Room | null> {
    const room = await this.prisma.room.findUnique({
      where: {
        id,
      },
    })

    if (!room) {
      return null
    }

    return PrismaRoomMapper.toDomain(room)
  }

  async findByName(companyId: string, name: string): Promise<Room | null> {
    const room = await this.prisma.room.findFirst({
      where: {
        companyId,
        name,
      },
    })

    if (!room) {
      return null
    }

    return PrismaRoomMapper.toDomain(room)
  }

  async fetchByCompany(companyId: string, page: number) {
    const rooms = await this.prisma.room.findMany({
      where: {
        companyId,
      },
      orderBy: {
        name: 'asc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    if (!rooms) {
      return null
    }

    return rooms.map(PrismaRoomMapper.toDomain)
  }

  async save(room: Room): Promise<void> {
    const data = PrismaRoomMapper.toPrisma(room)

    await this.prisma.room.update({
      where: {
        id: room.id.toString(),
      },
      data,
    })
  }

  async delete(room: Room): Promise<void> {
    await this.prisma.room.delete({
      where: {
        id: room.id.toString(),
      },
    })
  }
}
