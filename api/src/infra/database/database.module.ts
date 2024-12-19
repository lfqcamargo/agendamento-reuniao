import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { MeetingParticipantsRepository } from '@/domain/app/application/repositories/meeting-participants-repository'
import { RoomRepository } from '@/domain/app/application/repositories/room-repository'
import { RoomSchedulingRepository } from '@/domain/app/application/repositories/room-scheduling-repository'
import { CompanyRepository } from '@/domain/users/application/repositories/company-repository'
import { UserRepository } from '@/domain/users/application/repositories/user-repository'

import { PrismaService } from './prisma/prisma-service'
import { PrismaCompanyRepository } from './prisma/repositories/prisma-company-repository'
import { PrismaMeetingParticipantsRepository } from './prisma/repositories/prisma-meeting-participants'
import { PrismaRoomRepository } from './prisma/repositories/prisma-room-repository'
import { PrismaRoomSchedulingRepository } from './prisma/repositories/prisma-room-scheduling-repository'
import { PrismaUserRepository } from './prisma/repositories/prisma-user-repository'

@Module({
  providers: [
    PrismaService,
    PrismaClient,
    {
      provide: CompanyRepository,
      useClass: PrismaCompanyRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
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
    CompanyRepository,
    UserRepository,
    RoomRepository,
    RoomSchedulingRepository,
    MeetingParticipantsRepository,
  ],
})
export class DatabaseModule {}
