import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

describe('Create Company and User (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /companies', async () => {
    const response = await request(app.getHttpServer())
      .post('/companies')
      .send({
        cnpj: '12345678000190',
        companyName: 'Lfqcamargo',
        email: 'lfqcamargo@example.com.br',
        userName: 'Lucas Camargo',
        nickname: 'lfqcamargo',
        password: '123456789D',
      })

    expect(response.statusCode).toBe(201)

    const companyOnDatabase = await prisma.company.findUnique({
      where: {
        cnpj: '12345678000190',
      },
    })
    expect(companyOnDatabase).toBeTruthy()
    expect(companyOnDatabase?.name).toBe('Lfqcamargo')

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'lfqcamargo@example.com.br',
      },
    })
    expect(userOnDatabase).toBeTruthy()
    expect(userOnDatabase?.name).toBe('Lucas Camargo')
  })
})
