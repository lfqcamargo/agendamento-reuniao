import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { Optional } from '@/core/types/optional'

import { MeetingParticipant } from './meeting-participant'
import { MeetingParticipantsList } from './meeting-participants-list'

export interface RoomSchedulingProps {
  companyId: UniqueEntityID
  creatorId: UniqueEntityID
  roomId: UniqueEntityID
  startTime: Date
  endTime: Date
  participantsIds: MeetingParticipantsList
}

export class RoomScheduling extends AggregateRoot<RoomSchedulingProps> {
  get companyId() {
    return this.props.companyId
  }

  get creatorId() {
    return this.props.creatorId
  }

  get roomId() {
    return this.props.roomId
  }

  get startTime() {
    return this.props.startTime
  }

  get endTime() {
    return this.props.endTime
  }

  get participantsIds() {
    return this.props.participantsIds
  }

  set participantsIds(participantsIds: MeetingParticipantsList) {
    this.props.participantsIds = participantsIds
  }

  addParticipant(participant: MeetingParticipant) {
    if (this.props.participantsIds.exists(participant)) {
      throw new AlreadyExistsError('Participant already exists in the meeting.')
    }

    this.props.participantsIds.add(participant)
  }

  static create(
    props: Optional<RoomSchedulingProps, 'participantsIds'>,
    id?: UniqueEntityID,
  ) {
    const roomScheduling = new RoomScheduling(
      {
        ...props,
        participantsIds: props.participantsIds ?? new MeetingParticipantsList(),
      },
      id,
    )

    return roomScheduling
  }
}
