import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CompanyFactory } from 'test/factories/make-company'
import { MeetingFactory } from 'test/factories/make-meetings'
import { RoomFactory } from 'test/factories/make-room'
import { UserFactory } from 'test/factories/make-user'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

describe('Delete Meeting (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  let companyFactory: CompanyFactory
  let userFactory: UserFactory
  let roomFactory: RoomFactory
  let meetingFactory: MeetingFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CompanyFactory, UserFactory, RoomFactory, MeetingFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    companyFactory = moduleRef.get(CompanyFactory)
    userFactory = moduleRef.get(UserFactory)
    roomFactory = moduleRef.get(RoomFactory)
    meetingFactory = moduleRef.get(MeetingFactory)

    await app.init()
  })

  test('[DELETE] /meetings/:meetingId', async () => {
    const company = await companyFactory.makePrismaCompany()
    const creator = await userFactory.makePrismaUser({ companyId: company.id })
    const room = await roomFactory.makePrismaRoom({
      companyId: creator.companyId,
    })
    const meeting = await meetingFactory.makePrismaMeeting({
      companyId: creator.companyId,
      creatorId: creator.id,
      roomId: room.id,
    })

    const accessToken = jwt.sign({
      sub: creator.id.toString(),
      company: creator.companyId.toString(),
    })

    const response = await request(app.getHttpServer())
      .delete(`/meetings/${meeting.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const deletedMeeting = await prisma.meeting.findUnique({
      where: {
        id: meeting.id.toString(),
      },
    })

    expect(deletedMeeting).toBeNull()
  })
})
