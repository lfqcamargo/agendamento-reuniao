import { Injectable } from '@nestjs/common'

import { RoomSchedulingsRepository } from '@/domain/app/application/repositories/room-schedulings-repository'
import { RoomsRepository } from '@/domain/app/application/repositories/rooms-repository'
import { Room } from '@/domain/app/enterprise/entities/room'

import { PrismaRoomMapper } from '../mappers/prisma-room-mapper'
import { PrismaService } from '../prisma-service'

@Injectable()
export class PrismaRoomRepository implements RoomsRepository {
  constructor(
    private prisma: PrismaService,
    private roomSchedulingsRepository: RoomSchedulingsRepository,
  ) {}

  async create(room: Room): Promise<void> {
    const data = PrismaRoomMapper.toPrisma(room)

    await this.prisma.room.create({
      data,
    })
  }

  async findById(companyId: string, id: string): Promise<Room | null> {
    const room = await this.prisma.room.findUnique({
      where: {
        companyId,
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

  async fetchByCompanyId(
    companyId: string,
    page: number,
    itemsPerPage: number = 20,
  ) {
    const totalItems = await this.prisma.room.count({
      where: { companyId },
    })

    const rooms = await this.prisma.room.findMany({
      where: {
        companyId,
      },
      orderBy: {
        name: 'asc',
      },
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
    })

    if (!rooms) {
      return null
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage)

    return {
      data: rooms.map(PrismaRoomMapper.toDomain),
      meta: {
        totalItems,
        itemCount: rooms.length,
        itemsPerPage,
        totalPages,
        currentPage: page,
      },
    }
  }

  async save(room: Room): Promise<void> {
    const data = PrismaRoomMapper.toPrisma(room)

    if (room.active === false) {
      await this.roomSchedulingsRepository.deleteByRoomId(
        room.companyId.toString(),
        room.id.toString(),
      )
    }

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
