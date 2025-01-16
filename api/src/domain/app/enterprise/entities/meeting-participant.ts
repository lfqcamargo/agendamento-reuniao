import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface MeetingParticipantProps {
  companyId: UniqueEntityID
  participantId: UniqueEntityID
  meetingId: UniqueEntityID
  accept?: boolean
}

export class MeetingParticipant extends Entity<MeetingParticipantProps> {
  get companyId() {
    return this.props.companyId
  }

  get participantId() {
    return this.props.participantId
  }

  get meetingId() {
    return this.props.meetingId
  }

  get accept() {
    return this.props.accept
  }

  set participantId(participantId: UniqueEntityID) {
    this.props.participantId = participantId
  }

  set accept(accept: boolean | undefined) {
    this.props.accept = accept
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
