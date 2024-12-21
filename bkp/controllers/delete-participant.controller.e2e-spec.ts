import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CompanyFactory } from 'test/factories/make-company'
import { MeetingParticipantFactory } from 'test/factories/make-meeting-participant'
import { RoomFactory } from 'test/factories/make-room'
import { RoomSchedulingFactory } from 'test/factories/make-room-scheduling'
import { UserFactory } from 'test/factories/make-user'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

describe('Delete Participant (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  let companyFactory: CompanyFactory
  let userFactory: UserFactory
  let roomFactory: RoomFactory
  let roomSchedulingFactory: RoomSchedulingFactory
  let meetingParticipantFactory: MeetingParticipantFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        CompanyFactory,
        UserFactory,
        RoomFactory,
        RoomSchedulingFactory,
        MeetingParticipantFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    companyFactory = moduleRef.get(CompanyFactory)
    userFactory = moduleRef.get(UserFactory)
    roomFactory = moduleRef.get(RoomFactory)
    roomSchedulingFactory = moduleRef.get(RoomSchedulingFactory)
    meetingParticipantFactory = moduleRef.get(MeetingParticipantFactory)

    await app.init()
  })

  test('[DELETE] /meetings/participants/:meetingParticipantId', async () => {
    const company = await companyFactory.makePrismaCompany()
    const user = await userFactory.makePrismaUser({
      companyId: company.id,
      role: 1,
    })
    const room = await roomFactory.makePrismaRoom({ companyId: company.id })
    const roomScheduling = await roomSchedulingFactory.makePrismaRoomScheduling(
      {
        roomId: room.id,
        creatorId: user.id,
        companyId: user.companyId,
      },
    )
    const meetingParticipant =
      await meetingParticipantFactory.makePrismaMeetingParticipant({
        participantId: user.id,
        companyId: user.companyId,
        roomSchedulingId: roomScheduling.id,
      })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .delete(`/meetings/participants/${meetingParticipant.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    console.log(response.body.errors)
    expect(response.statusCode).toBe(204)

    const deletedParticipant = await prisma.meetingParticipant.findUnique({
      where: {
        id: meetingParticipant.id.toString(),
      },
    })

    expect(deletedParticipant).toBeNull()
  })
})
