import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CompanyFactory } from 'test/factories/make-company'
import { RoomFactory } from 'test/factories/make-room'
import { UserFactory } from 'test/factories/make-user'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch Rooms By Company ID (E2E)', () => {
  let app: INestApplication

  let companyFactory: CompanyFactory
  let userFactory: UserFactory
  let roomsFactory: RoomFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CompanyFactory, UserFactory, RoomFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    companyFactory = moduleRef.get(CompanyFactory)
    userFactory = moduleRef.get(UserFactory)
    roomsFactory = moduleRef.get(RoomFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /rooms', async () => {
    const company = await companyFactory.makePrismaCompany()
    const user = await userFactory.makePrismaUser({ companyId: company.id })
    const room1 = await roomsFactory.makePrismaRoom({
      companyId: company.id,
      name: 'Lucas Camargo',
      active: true,
    })
    const room2 = await roomsFactory.makePrismaRoom({
      companyId: company.id,
      name: 'Camargo Lucas',
      active: true,
    })

    const accessToken = jwt.sign({
      company: user.companyId.toString(),
      sub: user.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .get('/rooms?page=1')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      rooms: expect.arrayContaining([
        expect.objectContaining({
          id: room1.id.toString(),
          name: room1.name,
          active: room1.active,
        }),
        expect.objectContaining({
          id: room2.id.toString(),
          name: room2.name,
          active: room2.active,
        }),
      ]),
      meta: expect.objectContaining({
        totalItems: 2,
        itemCount: 2,
        itemsPerPage: 20,
        totalPages: 1,
        currentPage: 1,
      }),
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
