import { Prisma, User as PrismaUser } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/users/enterprise/entities/user'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    const user = User.create(
      {
        companyId: new UniqueEntityID(raw.companyId),
        name: raw.name,
        nickname: raw.nickname,
        email: raw.email,
        password: raw.password,
        role: raw.role,
        active: raw.active,
        profilePhoto: raw.profilePhoto,
        createdAt: raw.createdAt,
        lastLogin: raw.lastLogin,
      },
      new UniqueEntityID(raw.id),
    )

    return user
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      companyId: user.companyId.toString(),
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      password: user.password,
      role: user.role,
      active: user.active,
      profilePhoto: user.profilePhoto,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    }
  }
}
