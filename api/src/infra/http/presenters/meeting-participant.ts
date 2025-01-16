import { MeetingParticipant } from '@/domain/app/enterprise/entities/meeting-participant'

export class MeetingParticipantPresenter {
  static toHTTP(meetingparticipant: MeetingParticipant) {
    return {
      companyId: meetingparticipant.companyId.toString(),
      id: meetingparticipant.id.toString(),
      participantId: meetingparticipant.participantId.toString(),
      meetingId: meetingparticipant.meetingId.toString(),
    }
  }
}
