import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/users/enterprise/entities/user'
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      companyId: new UniqueEntityID(faker.string.uuid()),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      nickname: faker.internet.username(),
      password: faker.internet.password(),
      role: faker.number.int(1),
      ...override,
    },
    id,
  )

  return user
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data)

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })

    return user
  }
}
