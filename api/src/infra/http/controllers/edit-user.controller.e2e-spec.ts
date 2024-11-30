import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CompanyFactory } from 'test/factories/make-company'
import { UserFactory } from 'test/factories/make-user'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

describe('Edit User (E2E)', () => {
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

  test('[PUT] /users - success case', async () => {
    const company = await companyFactory.makePrismaCompany()
    const user = await userFactory.makePrismaUser({
      companyId: company.id,
      role: 1,
    })
    const userToEdit = await userFactory.makePrismaUser({
      companyId: company.id,
    })
    const accessToken = jwt.sign({
      sub: user.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .put('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        id: userToEdit.id.toString(),
        name: 'Lucas Camargo',
        nickname: 'lfqcamargo',
        password: '123456789lfqcamargo',
        role: 1,
        active: true,
      })

    expect(response.statusCode).toBe(200)

    const updatedUser = await prisma.user.findUnique({
      where: {
        id: userToEdit.id.toString(),
      },
    })

    expect(updatedUser).toBeTruthy()
    expect(updatedUser?.name).toBe('Lucas Camargo')
    expect(updatedUser?.nickname).toBe('lfqcamargo')
    expect(updatedUser?.active).toBe(true)
  })
})
