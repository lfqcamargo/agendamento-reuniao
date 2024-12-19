import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CompanyFactory } from 'test/factories/make-company'
import { RoomFactory } from 'test/factories/make-room'
import { UserFactory } from 'test/factories/make-user'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

describe('Create Meeting (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  let companyFactory: CompanyFactory
  let userFactory: UserFactory
  let roomFactory: RoomFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CompanyFactory, UserFactory, RoomFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    companyFactory = moduleRef.get(CompanyFactory)
    userFactory = moduleRef.get(UserFactory)
    roomFactory = moduleRef.get(RoomFactory)

    await app.init()
  })

  test('[POST] /meetings', async () => {
    const company = await companyFactory.makePrismaCompany()
    const creator = await userFactory.makePrismaUser({ companyId: company.id })
    const room = await roomFactory.makePrismaRoom({
      companyId: creator.companyId,
    })
    const participant = await userFactory.makePrismaUser({
      companyId: creator.companyId,
    })

    const accessToken = jwt.sign({ sub: creator.id.toString() })

    const startTime = new Date().toISOString()
    const endTime = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    const response = await request(app.getHttpServer())
      .post('/meetings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        creatorId: creator.id.toString(),
        roomId: room.id.toString(),
        startTime,
        endTime,
        participantsIds: [participant.id.toString()],
      })

    // expect(response.statusCode).toBe(201)

    const meetingOnDatabase = await prisma.roomScheduling.findFirst({
      where: {
        creatorId: creator.id.toString(),
        roomId: room.id.toString(),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    })
  })
})
