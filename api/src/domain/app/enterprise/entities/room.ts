import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface RoomProps {
  companyId: UniqueEntityID
  name: string
  active: boolean
}

export class Room extends Entity<RoomProps> {
  get companyId() {
    return this.props.companyId
  }

  get name() {
    return this.props.name
  }

  get active() {
    return this.props.active
  }

  set name(name: string) {
    this.props.name = name
  }

  set active(active: boolean) {
    this.props.active = active
  }

  static create(props: RoomProps, id?: UniqueEntityID) {
    const room = new Room(
      {
        ...props,
      },
      id,
    )

    return room
  }
}
