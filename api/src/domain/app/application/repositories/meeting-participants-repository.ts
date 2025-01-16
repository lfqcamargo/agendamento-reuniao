import { MeetingParticipant } from '@/domain/app/enterprise/entities/meeting-participant'

export abstract class MeetingParticipantsRepository {
  abstract create(meetingParticipant: MeetingParticipant): Promise<void>
  abstract createMany(meetingParticipant: MeetingParticipant): Promise<void>
  abstract findById(id: string): Promise<MeetingParticipant | null>
  abstract fetchParticipants(
    companyId: string,
    meetingId: string,
  ): Promise<MeetingParticipant[] | null>

  abstract delete(meetingParticipants: MeetingParticipant): Promise<void>
}
