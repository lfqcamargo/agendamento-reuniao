import { RoomRepository } from '@/domain/app/application/repositories/room-repository'
import { Room } from '@/domain/app/enterprise/entities/room'

export class InMemoryRoomRepository implements RoomRepository {
  public items: Room[] = []

  async create(data: Room) {
    this.items.push(data)
  }

  async findById(id: string) {
    const room = this.items.find((item) => item.id.toString() === id)

    if (!room) {
      return null
    }

    return room
  }

  async findByName(companyId: string, name: string) {
    const room = this.items.find(
      (item) =>
        item.companyId.toString() === companyId &&
        item.name.toString() === name,
    )

    if (!room) {
      return null
    }

    return room
  }

  async fetchByCompany(companyId: string) {
    const rooms = this.items.filter(
      (item) => item.companyId.toString() === companyId,
    )

    if (!rooms) {
      return null
    }

    return rooms
  }

  async save(data: Room) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === data.id.toString(),
    )

    this.items[itemIndex] = data
  }

  async delete(room: Room) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === room.id.toString(),
    )

    this.items.splice(itemIndex, 1)
  }
}
