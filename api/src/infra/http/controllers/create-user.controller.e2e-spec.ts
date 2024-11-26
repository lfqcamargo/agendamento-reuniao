import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CompanyFactory } from 'test/factories/make-company'
import { UserFactory } from 'test/factories/make-user'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

describe('Create User and User (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
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

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /users', async () => {
    const company = await companyFactory.makePrismaCompany()
    const user = await userFactory.makePrismaUser({ companyId: company.id })
    const acessToken = jwt.sign({
      sub: user.id.toString(),
      company: user.companyId.toString(),
    })

    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${acessToken}`)
      .send({
        name: 'Lucas Camargo',
        nickname: 'lfqcamargo',
        email: 'lfqcamargo@example.com.br',
        password: '123456789D',
        role: 1,
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'lfqcamargo@example.com.br',
      },
    })
    expect(userOnDatabase).toBeTruthy()
    expect(userOnDatabase?.name).toBe('Lucas Camargo')

    expect(userOnDatabase).toBeTruthy()
  })
})
