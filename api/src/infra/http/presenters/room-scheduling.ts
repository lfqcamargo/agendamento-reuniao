import { Meeting } from '@/domain/app/enterprise/entities/meeting'

export class MeetingPresenter {
  static toHTTP(meeting: Meeting) {
    return {
      companyId: meeting.companyId.toString(),
      id: meeting.id.toString(),
      creatorId: meeting.creatorId.toString(),
      roomId: meeting.roomId.toString(),
      startTime: meeting.startTime,
      endTime: meeting.endTime,
    }
  }
}
