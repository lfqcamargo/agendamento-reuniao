import { Injectable } from '@nestjs/common'

import { UserRepository } from '@/domain/users/application/repositories/user-repository'
import { User } from '@/domain/users/enterprise/entities/user'

import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { PrismaService } from '../prisma-service'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.create({
      data,
    })
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findByNickname(
    companyId: string,
    nickname: string,
  ): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        companyId,
        nickname,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }
}
