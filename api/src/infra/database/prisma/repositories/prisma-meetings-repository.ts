import { Injectable } from '@nestjs/common'

// import { MeetingParticipant } from '@prisma/client'
// import { MeetingParticipantsRepository } from '@/domain/app/application/repositories/meeting-participants-repository'
import { MeetingsRepository } from '@/domain/app/application/repositories/meetings-repository'
import { Meeting } from '@/domain/app/enterprise/entities/meeting'

import { PrismaMeetingMapper } from '../mappers/prisma-meeting-mapper'
import { PrismaService } from '../prisma-service'

@Injectable()
export class PrismaMeetingRepository implements MeetingsRepository {
  constructor(
    private prisma: PrismaService,
    // private meetingParticipantRepository: MeetingParticipantsRepository,
  ) {}

  async create(meeting: Meeting): Promise<void> {
    const data = PrismaMeetingMapper.toPrisma(meeting)

    await this.prisma.meeting.create({
      data,
    })

    // meeting.participantsIds.add(meeting.creatorId.toString())

    // await this.meetingParticipantRepository.createMany(
    //   meeting.participantsIds.getItems(),
    // )
  }

  async findById(companyId: string, id: string): Promise<Meeting | null> {
    const meeting = await this.prisma.meeting.findUnique({
      where: {
        companyId,
        id,
      },
    })

    if (!meeting) {
      return null
    }

    return PrismaMeetingMapper.toDomain(meeting)
  }

  async fetchScheduledTimes(
    companyId: string,
    roomId: string,
    startTime: Date | null,
    endTime: Date | null,
    page: number,
    itemsPerPage: number,
  ) {
    const totalItems = await this.prisma.meeting.count({
      where: {
        companyId,
        roomId,
        startTime: startTime ? { gte: startTime } : undefined,
        endTime: endTime ? { lte: endTime } : undefined,
      },
    })

    const schedules = await this.prisma.meeting.findMany({
      where: {
        companyId,
        roomId,
        startTime: startTime ? { gte: startTime } : undefined,
        endTime: endTime ? { lte: endTime } : undefined,
      },
      orderBy: {
        startTime: 'asc',
      },
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
    })

    if (!schedules.length) {
      return null
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage)

    return {
      data: schedules.map(PrismaMeetingMapper.toDomain),
      meta: {
        totalItems,
        itemCount: schedules.length,
        itemsPerPage,
        totalPages,
        currentPage: page,
      },
    }
  }

  async save(meeting: Meeting): Promise<void> {
    const data = PrismaMeetingMapper.toPrisma(meeting)

    await this.prisma.meeting.update({
      where: {
        id: meeting.id.toString(),
      },
      data,
    })

    // this.prisma.meetinParticipant.meetinParticipant
  }

  async delete(meeting: Meeting): Promise<void> {
    await this.prisma.meeting.delete({
      where: {
        id: meeting.id.toString(),
      },
    })
  }

  async deleteByRoomId(companyId: string, roomId: string): Promise<void> {
    await this.prisma.meeting.deleteMany({
      where: {
        companyId,
        roomId,
      },
    })
  }
}
