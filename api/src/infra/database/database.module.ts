import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { MeetingParticipantsRepository } from '@/domain/app/application/repositories/meeting-participants-repository'
import { RoomSchedulingsRepository } from '@/domain/app/application/repositories/room-schedulings-repository'
import { RoomsRepository } from '@/domain/app/application/repositories/rooms-repository'
import { CompaniesRepository } from '@/domain/users/application/repositories/companies-repository'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'

import { PrismaService } from './prisma/prisma-service'
import { PrismaCompaniesRepository } from './prisma/repositories/prisma-companies-repository'
import { PrismaMeetingParticipantsRepository } from './prisma/repositories/prisma-meeting-participants'
import { PrismaRoomSchedulingRepository } from './prisma/repositories/prisma-room-scheduling-repository'
import { PrismaRoomRepository } from './prisma/repositories/prisma-rooms-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'

@Module({
  providers: [
    PrismaService,
    PrismaClient,
    {
      provide: CompaniesRepository,
      useClass: PrismaCompaniesRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: RoomsRepository,
      useClass: PrismaRoomRepository,
    },
    {
      provide: RoomSchedulingsRepository,
      useClass: PrismaRoomSchedulingRepository,
    },
    {
      provide: MeetingParticipantsRepository,
      useClass: PrismaMeetingParticipantsRepository,
    },
  ],
  exports: [
    PrismaService,
    PrismaClient,
    CompaniesRepository,
    UsersRepository,
    RoomsRepository,
    RoomSchedulingsRepository,
    MeetingParticipantsRepository,
  ],
})
export class DatabaseModule {}
