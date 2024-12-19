import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CompanyFactory } from 'test/factories/make-company'
import { UserFactory } from 'test/factories/make-user'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

describe('Fetch Rooms By Company ID (E2E)', () => {
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

  test('[GET] /rooms', async () => {
    const company = await companyFactory.makePrismaCompany()
    const user = await userFactory.makePrismaUser({ companyId: company.id })

    const room1 = await prisma.room.create({
      data: {
        companyId: company.id.toString(),
        name: 'Room 1',
        active: true,
      },
    })

    const room2 = await prisma.room.create({
      data: {
        companyId: company.id.toString(),
        name: 'Room 2',
        active: false,
      },
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      company: user.companyId.toString(),
    })

    const response = await request(app.getHttpServer())
      .get('/rooms?page=1')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      rooms: expect.arrayContaining([
        expect.objectContaining({
          id: room1.id.toString(),
          companyId: company.id.toString(),
          name: room1.name,
          active: room1.active,
        }),
        expect.objectContaining({
          id: room2.id.toString(),
          companyId: company.id.toString(),
          name: room2.name,
          active: room2.active,
        }),
      ]),
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
