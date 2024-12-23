import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CompanyFactory } from 'test/factories/make-company'
import { UserFactory } from 'test/factories/make-user'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

describe('Create Room (E2E)', () => {
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

  test('[POST] /rooms', async () => {
    const company = await companyFactory.makePrismaCompany()
    const user = await userFactory.makePrismaUser({
      companyId: company.id,
      role: 1,
    })
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      company: user.companyId.toString(),
    })

    const response = await request(app.getHttpServer())
      .post('/rooms')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test Room',
        active: true,
      })

    expect(response.statusCode).toBe(201)

    const roomOnDatabase = await prisma.room.findFirst({
      where: {
        companyId: user.companyId.toString(),
        name: 'Test Room',
      },
    })
    expect(roomOnDatabase).toBeTruthy()
    expect(roomOnDatabase?.name).toBe('Test Room')
    expect(roomOnDatabase?.active).toBe(true)
  })
})
