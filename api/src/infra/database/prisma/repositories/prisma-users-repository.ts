import { Injectable } from '@nestjs/common'

import { UsersRepository } from '@/domain/users/application/repositories/users-repository'
import { User } from '@/domain/users/enterprise/entities/user'

import { PrismaUserMapper } from '../mappers/prisma-user-mapper'
import { PrismaService } from '../prisma-service'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.create({
      data,
    })
  }

  async createMany(users: User[]): Promise<void> {
    if (users.length === 0) {
      return
    }

    const data = users.map((user) => PrismaUserMapper.toPrisma(user))

    await this.prisma.user.createMany({
      data,
    })
  }

  async findById(companyId: string, id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        companyId,
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

  async fetchAllAdmins(companyId: string) {
    const usersAdmin = await this.prisma.user.findMany({
      where: {
        companyId,
      },
    })

    return usersAdmin.map(PrismaUserMapper.toDomain)
  }

  async fetchUsersByCompanyId(companyId: string, page: number) {
    const users = await this.prisma.user.findMany({
      where: {
        companyId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    if (!users) {
      return null
    }

    return users.map(PrismaUserMapper.toDomain)
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data,
    })
  }

  async delete(user: User): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: user.id.toString(),
      },
    })
  }
}
