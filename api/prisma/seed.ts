// import { randomInt } from 'node:crypto'

import { CompanyFactory } from 'test/factories/make-company'
// import { MeetingParticipantFactory } from 'test/factories/make-meeting-participant'
import { RoomFactory } from 'test/factories/make-room'
// import { MeetingFactory } from 'test/factories/make-room-scheduling'
import { UserFactory } from 'test/factories/make-user'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
// import { MeetingParticipantsList } from '@/domain/app/enterprise/entities/meeting-participants-list'
import { PrismaService } from '@/infra/database/prisma/prisma-service'

const prisma = new PrismaService()
const companyFactory = new CompanyFactory(prisma)
const userFactory = new UserFactory(prisma)
const roomFactory = new RoomFactory(prisma)
// const meetingFactory = new MeetingFactory(prisma)
// const meetingParticipantFactory = new MeetingParticipantFactory(prisma)

async function main() {
  await prisma.meetingParticipant.deleteMany()
  await prisma.meeting.deleteMany()
  await prisma.room.deleteMany()
  await prisma.user.deleteMany()
  await prisma.company.deleteMany()

  const companies: string[] = []
  const users: string[] = []
  const rooms: string[] = []
  // const meetings: string[] = []

  for (let c = 1; c <= 3; c++) {
    const company = await companyFactory.makePrismaCompany()
    companies.push(company.id.toString())

    for (let i = 1; i <= 22; i++) {
      const user = await userFactory.makePrismaUser({ companyId: company.id })
      users.push(user.id.toString())
    }

    for (let r = 1; r <= 6; r++) {
      const room = await roomFactory.makePrismaRoom({ companyId: company.id })
      rooms.push(room.id.toString())

      // for (let rs = 1; rs <= 30; rs++) {
      //   const randomNumber = randomInt(1, 20)
      //   const randomParticipants: MeetingParticipantsList[] = []

      //   for (let rp = 1; rp <= 10; rp++) {
      //     const meetingParticipant =
      //       await meetingParticipantFactory.makePrismaMeetingParticipant({
      //         companyId: company.id,
      //         participantId: new UniqueEntityID(users[rp]),
      //       })
      //   }

      //   const meeting =
      //     await meetingFactory.makePrismaMeeting({
      //       companyId: company.id,
      //       creatorId: new UniqueEntityID(users[randomNumber]),
      //       participantsIds: meetingParticipantList,
      //     })

      //   meetings.push(meeting.id.toString())
      // }
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
