import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { MeetingParticipantsRepository } from '@/domain/app/application/repositories/meeting-participants-repository'
import { RoomRepository } from '@/domain/app/application/repositories/room-repository'
import { RoomSchedulingRepository } from '@/domain/app/application/repositories/room-scheduling-repository'
import { CompaniesRepository } from '@/domain/users/application/repositories/companies-repository'
import { UsersRepository } from '@/domain/users/application/repositories/users-repository'

import { PrismaService } from './prisma/prisma-service'
import { PrismaCompaniesRepository } from './prisma/repositories/prisma-companies-repository'
import { PrismaMeetingParticipantsRepository } from './prisma/repositories/prisma-meeting-participants'
import { PrismaRoomRepository } from './prisma/repositories/prisma-room-repository'
import { PrismaRoomSchedulingRepository } from './prisma/repositories/prisma-room-scheduling-repository'
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
      provide: RoomRepository,
      useClass: PrismaRoomRepository,
    },
    {
      provide: RoomSchedulingRepository,
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
    RoomRepository,
    RoomSchedulingRepository,
    MeetingParticipantsRepository,
  ],
})
export class DatabaseModule {}
