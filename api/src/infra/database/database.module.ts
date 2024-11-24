import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { CompanyRepository } from '@/domain/users/application/repositories/company-repository'
import { UserRepository } from '@/domain/users/application/repositories/user-repository'

import { PrismaService } from './prisma/prisma-service'
import { PrismaCompanyRepository } from './prisma/repositories/prisma-company-repository'
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
  ],
  exports: [PrismaService, PrismaClient, CompanyRepository, UserRepository],
})
export class DatabaseModule {}
