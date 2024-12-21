import { CompanyFactory } from 'test/factories/make-company'
import { UserFactory } from 'test/factories/make-user'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

const prisma = new PrismaService()
const companyFactory = new CompanyFactory(prisma)
const userFactory = new UserFactory(prisma)

async function main() {
  await prisma.user.deleteMany()
  await prisma.company.deleteMany()

  const companies: string[] = []
  const users: string[] = []

  for (let c = 1; c <= 3; c++) {
    const company = await companyFactory.makePrismaCompany()
    companies.push(company.id.toString())
    for (let i = 1; i <= 22; i++) {
      const user = await userFactory.makePrismaUser({ companyId: company.id })
      users.push(user.id.toString())
    }
  }

  await userFactory.makePrismaUser({
    companyId: new UniqueEntityID(companies[0]),
    email: 'lfqcamargo@gmail.com',
    name: 'Lucas Camargo',
    nickname: 'lfqcamargo',
    password: '123456789',
    role: 1,
    active: true,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
