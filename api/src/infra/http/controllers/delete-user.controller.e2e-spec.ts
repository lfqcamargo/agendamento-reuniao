import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CompanyFactory } from 'test/factories/make-company'
import { UserFactory } from 'test/factories/make-user'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

describe('Delete User (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let companyFactory: CompanyFactory
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CompanyFactory, UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    companyFactory = moduleRef.get(CompanyFactory)
    userFactory = moduleRef.get(UserFactory)

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /users - success case', async () => {
    const company = await companyFactory.makePrismaCompany()
    const adminUser = await userFactory.makePrismaUser({
      companyId: company.id,
      role: 1,
    })
    const userToDelete = await userFactory.makePrismaUser({
      companyId: company.id,
    })
    const accessToken = jwt.sign({
      sub: adminUser.id.toString(),
      company: adminUser.companyId.toString(),
    })

    const response = await request(app.getHttpServer())
      .delete(`/users/${userToDelete.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    const deletedUser = await prisma.user.findUnique({
      where: {
        id: userToDelete.id.toString(),
      },
    })

    expect(deletedUser).toBeNull()
  })
})
