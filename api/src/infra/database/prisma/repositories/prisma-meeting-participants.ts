import { Injectable } from '@nestjs/common'

import { MeetingParticipantsRepository } from '@/domain/app/application/repositories/meeting-participants-repository'
import { MeetingParticipant } from '@/domain/app/enterprise/entities/meeting-participant'

import { PrismaMeetingParticipantMapper } from '../mappers/prisma-meeting-participant-mapper'
import { PrismaService } from '../prisma-service'

@Injectable()
export class PrismaMeetingParticipantsRepository
  implements MeetingParticipantsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(meetingParticipant: MeetingParticipant): Promise<void> {
    const data = PrismaMeetingParticipantMapper.toPrisma(meetingParticipant)

    await this.prisma.meetingParticipant.create({
      data,
    })
  }

  async findById(id: string): Promise<MeetingParticipant | null> {
    const participant = await this.prisma.meetingParticipant.findUnique({
      where: {
        id,
      },
    })

    if (!participant) {
      return null
    }

    return PrismaMeetingParticipantMapper.toDomain(participant)
  }

  async fetchParticipants(
    companyId: string,
    roomSchedulingId: string,
  ): Promise<MeetingParticipant[] | null> {
    const participants = await this.prisma.meetingParticipant.findMany({
      where: {
        companyId,
        roomSchedulingId,
      },
    })

    if (!participants.length) {
      return null
    }

    return participants.map(PrismaMeetingParticipantMapper.toDomain)
  }

  async delete(meetingParticipant: MeetingParticipant): Promise<void> {
    await this.prisma.meetingParticipant.delete({
      where: {
        id: meetingParticipant.id.toString(),
      },
    })
  }
}
