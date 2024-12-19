import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { RoomFactory } from 'test/factories/make-room'
import { UserFactory } from 'test/factories/make-user'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

describe('Create Meeting (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let roomFactory: RoomFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, RoomFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    roomFactory = moduleRef.get(RoomFactory)

    await app.init()
  })

  test('[POST] /meetings', async () => {
    const creator = await userFactory.makePrismaUser()
    const room = await roomFactory.makePrismaRoom({
      companyId: creator.companyId,
    })
    const participant = await userFactory.makePrismaUser({
      companyId: creator.companyId,
    })

    const startTime = new Date().toISOString()
    const endTime = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    const response = await request(app.getHttpServer())
      .post('/meetings')
      .send({
        creatorId: creator.id.toString(),
        roomId: room.id.toString(),
        startTime,
        endTime,
        participantsIds: [participant.id.toString()],
      })

    expect(response.statusCode).toBe(201)

    const meetingOnDatabase = await prisma.roomScheduling.findFirst({
      where: {
        creatorId: creator.id.toString(),
        roomId: room.id.toString(),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    })

    expect(meetingOnDatabase).toBeTruthy()
    expect(meetingOnDatabase?.creatorId).toBe(creator.id)
    expect(meetingOnDatabase?.roomId).toBe(room.id)

    const participantsOnDatabase = await prisma.meetingParticipant.findMany({
      where: {
        roomSchedulingId: meetingOnDatabase?.id,
      },
    })

    expect(participantsOnDatabase).toHaveLength(1)
    expect(participantsOnDatabase[0].participantId).toBe(participant.id)
  })
})
