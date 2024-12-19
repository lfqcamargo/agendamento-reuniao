import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CompanyFactory } from 'test/factories/make-company'
import { RoomFactory } from 'test/factories/make-room'
import { RoomSchedulingFactory } from 'test/factories/make-room-scheduling'
import { UserFactory } from 'test/factories/make-user'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

describe('Add Participant (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  let companyFactory: CompanyFactory
  let userFactory: UserFactory
  let roomFactory: RoomFactory
  let roomSchedulingFactory: RoomSchedulingFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        CompanyFactory,
        UserFactory,
        RoomFactory,
        RoomSchedulingFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    companyFactory = moduleRef.get(CompanyFactory)
    userFactory = moduleRef.get(UserFactory)
    roomFactory = moduleRef.get(RoomFactory)
    roomSchedulingFactory = moduleRef.get(RoomSchedulingFactory)

    await app.init()
  })

  test('[POST] /meetings/add-participant', async () => {
    const company = await companyFactory.makePrismaCompany()
    const participant = await userFactory.makePrismaUser({
      companyId: company.id,
    })
    const room = await roomFactory.makePrismaRoom({ companyId: company.id })
    const roomScheduling = await roomSchedulingFactory.makePrismaRoomScheduling(
      {
        companyId: participant.companyId,
        roomId: room.id,
        creatorId: participant.id,
      },
    )

    const accessToken = jwt.sign({ sub: participant.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/meetings/add-participant')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        participantId: participant.id.toString(),
        roomSchedulesId: roomScheduling.id.toString(),
      })

    expect(response.statusCode).toBe(200)

    const addedParticipant = await prisma.meetingParticipant.findFirst({
      where: {
        participantId: participant.id.toString(),
        roomSchedulingId: roomScheduling.id.toString(),
      },
    })
  })
})
