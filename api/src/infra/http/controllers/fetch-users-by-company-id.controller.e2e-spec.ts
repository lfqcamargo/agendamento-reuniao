import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CompanyFactory } from 'test/factories/make-company'
import { UserFactory } from 'test/factories/make-user'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch Users By Company ID (E2E)', () => {
  let app: INestApplication
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

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /users', async () => {
    const company = await companyFactory.makePrismaCompany()
    const user1 = await userFactory.makePrismaUser({
      companyId: company.id,
      role: 1,
    })
    const user2 = await userFactory.makePrismaUser({
      companyId: company.id,
      role: 2,
    })

    const accessToken = jwt.sign({
      company: user1.companyId.toString(),
      sub: user1.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .get('/companies/users?page=1')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      users: expect.arrayContaining([
        expect.objectContaining({
          id: user1.id.toString(),
          companyId: company.id.toString(),
          name: user1.name,
          nickname: user1.nickname,
          email: user1.email,
          role: user1.role,
          active: user1.active,
          lastLogin: user1.lastLogin?.toISOString() || null,
        }),
        expect.objectContaining({
          id: user2.id.toString(),
          companyId: company.id.toString(),
          name: user2.name,
          nickname: user2.nickname,
          email: user2.email,
          role: user2.role,
          active: user2.active,
          lastLogin: user2.lastLogin?.toISOString() || null,
        }),
      ]),
      meta: {
        totalItems: 2,
        itemCount: 2,
        itemsPerPage: 20,
        totalPages: 1,
        currentPage: 1,
      },
    })
  })
})
