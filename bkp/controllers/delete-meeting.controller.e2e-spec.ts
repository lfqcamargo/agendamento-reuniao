import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CompanyFactory } from 'test/factories/make-company'
import { RoomFactory } from 'test/factories/make-room'
import { RoomSchedulingFactory } from 'test/factories/make-room-scheduling'
import { UserFactory } from 'test/factories/make-user'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

describe('Delete Meeting (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
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
    companyFactory = moduleRef.get(CompanyFactory)
    userFactory = moduleRef.get(UserFactory)
    roomFactory = moduleRef.get(RoomFactory)
    roomSchedulingFactory = moduleRef.get(RoomSchedulingFactory)

    await app.init()
  })

  test('[DELETE] /meetings/:meetingId', async () => {
    const company = await companyFactory.makePrismaCompany()
    const creator = await userFactory.makePrismaUser({ companyId: company.id })
    const room = await roomFactory.makePrismaRoom({
      companyId: creator.companyId,
    })
    const roomScheduling = await roomSchedulingFactory.makePrismaRoomScheduling(
      {
        roomId: room.id,
        creatorId: creator.id,
        companyId: creator.companyId,
      },
    )

    const response = await request(app.getHttpServer()).delete(
      `/meetings/${roomScheduling.id.toString()}`,
    )

    // expect(response.statusCode).toBe(204)

    const deletedMeeting = await prisma.roomScheduling.findUnique({
      where: {
        id: roomScheduling.id.toString(),
      },
    })
  })
})
