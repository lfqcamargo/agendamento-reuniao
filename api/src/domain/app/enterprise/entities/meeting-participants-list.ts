import { WatchedList } from '@/core/entities/watched-list'

import { MeetingParticipant } from './meeting-participant'

export class MeetingParticipantsList extends WatchedList<MeetingParticipant> {
  compareItems(a: MeetingParticipant, b: MeetingParticipant): boolean {
    return a.id.equals(b.id)
  }
}
