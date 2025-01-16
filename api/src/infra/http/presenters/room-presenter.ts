import { Room } from '@/domain/app/enterprise/entities/room'

export class RoomPresenter {
  static toHTTP(room: Room) {
    return {
      id: room.id.toString(),
      name: room.name,
      active: room.active,
    }
  }
}
