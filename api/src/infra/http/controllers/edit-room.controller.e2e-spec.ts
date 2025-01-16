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

describe('Edit Room (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let companyFactory: CompanyFactory
  let userFactory: UserFactory
  let roomFactory: RoomFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CompanyFactory, UserFactory, RoomFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    companyFactory = moduleRef.get(CompanyFactory)
    userFactory = moduleRef.get(UserFactory)
    roomFactory = moduleRef.get(RoomFactory)

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /rooms/:id', async () => {
    const company = await companyFactory.makePrismaCompany()
    const user = await userFactory.makePrismaUser({
      companyId: company.id,
      role: 1,
    })
    const room = await roomFactory.makePrismaRoom({ companyId: company.id })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      company: user.companyId.toString(),
    })

    const response = await request(app.getHttpServer())
      .patch(`/rooms/${room.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Updated Room Name',
        active: false,
      })

    expect(response.statusCode).toBe(200)

    const roomOnDatabase = await prisma.room.findUnique({
      where: {
        id: room.id.toString(),
      },
    })
    expect(roomOnDatabase).toBeTruthy()
    expect(roomOnDatabase?.name).toBe('Updated Room Name')
    expect(roomOnDatabase?.active).toBe(false)
  })

  afterAll(async () => {
    await app.close()
  })
})
