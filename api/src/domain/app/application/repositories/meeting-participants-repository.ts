import { MeetingParticipant } from '@/domain/app/enterprise/entities/meeting-participant'

export abstract class MeetingParticipantsRepository {
  abstract create(MeetingParticipant: MeetingParticipant): Promise<void>
  abstract findById(id: string): Promise<MeetingParticipant | null>
  abstract fetchParticipants(
    companyId: string,
    roomSchedulingId: string,
  ): Promise<MeetingParticipant[] | null>

  abstract delete(meetingParticipants: MeetingParticipant): Promise<void>
}
