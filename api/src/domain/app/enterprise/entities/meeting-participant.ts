import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface MeetingParticipantProps {
  companyId: UniqueEntityID
  participantId: UniqueEntityID
  roomSchedulingId: UniqueEntityID
}

export class MeetingParticipant extends Entity<MeetingParticipantProps> {
  get companyId() {
    return this.props.companyId
  }

  get participantId() {
    return this.props.participantId
  }

  get roomSchedulingId() {
    return this.props.roomSchedulingId
  }

  set participantId(participantId: UniqueEntityID) {
    this.props.participantId = participantId
  }

  static create(props: MeetingParticipantProps, id?: UniqueEntityID) {
    const meetingParticipant = new MeetingParticipant(
      {
        ...props,
      },
      id,
    )

    return meetingParticipant
  }
}
