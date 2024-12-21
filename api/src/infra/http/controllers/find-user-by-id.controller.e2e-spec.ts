import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CompanyFactory } from 'test/factories/make-company'
import { UserFactory } from 'test/factories/make-user'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Find User By ID (E2E)', () => {
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

  test('[GET] /users/:id', async () => {
    const company = await companyFactory.makePrismaCompany()
    const user = await userFactory.makePrismaUser({
      companyId: company.id,
    })
    const accessToken = jwt.sign({
      company: user.companyId.toString(),
      sub: user.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .get(`/users/${user.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.user).toMatchObject({
      id: user.id.toString(),
      companyId: company.id.toString(),
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      role: user.role,
      active: user.active,
      lastLogin: user.lastLogin?.toISOString() || null,
    })
  })
})
