import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { RoomSchedulingFactory } from 'test/factories/make-room-scheduling'
import { UserFactory } from 'test/factories/make-user'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

describe('Add Participant (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let roomSchedulingFactory: RoomSchedulingFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RoomSchedulingFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    roomSchedulingFactory = moduleRef.get(RoomSchedulingFactory)

    await app.init()
  })

  test('[POST] /meetings/add-participant', async () => {
    const participant = await userFactory.makePrismaUser()
    const roomScheduling = await roomSchedulingFactory.makePrismaRoomScheduling(
      {
        companyId: participant.companyId,
      },
    )

    const response = await request(app.getHttpServer())
      .post('/meetings/add-participant')
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

    expect(addedParticipant).toBeTruthy()
    expect(addedParticipant?.participantId).toBe(participant.id)
    expect(addedParticipant?.roomSchedulingId).toBe(roomScheduling.id)
  })

  afterAll(async () => {
    await app.close()
  })
})
