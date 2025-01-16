import { MeetingParticipantsRepository } from '@/domain/app/application/repositories/meeting-participants-repository'
import { MeetingParticipant } from '@/domain/app/enterprise/entities/meeting-participant'

export class InMemoryMeetingParticipantsRepository
  implements MeetingParticipantsRepository
{
  public items: MeetingParticipant[] = []

  async create(meetingParticipant: MeetingParticipant): Promise<void> {
    this.items.push(meetingParticipant)
  }

  async findById(id: string): Promise<MeetingParticipant | null> {
    const participant = this.items.find((item) => item.id.toString() === id)
    if (!participant) {
      return null
    }
    return participant
  }

  async fetchParticipants(
    companyId: string,
    schedulesRoomId: string,
  ): Promise<MeetingParticipant[] | null> {
    const participants = this.items.filter(
      (item) =>
        item.companyId.toString() === companyId &&
        item.meetingId.toString() === schedulesRoomId,
    )

    if (participants.length === 0) {
      return null
    }

    return participants
  }

  async delete(meetingParticipant: MeetingParticipant): Promise<void> {
    this.items = this.items.filter((item) => {
      return item.id.toString() !== meetingParticipant.id.toString()
    })
  }
}
