import { RoomSchedulingRepository } from '@/domain/app/application/repositories/room-schedulings-repository'
import { RoomScheduling } from '@/domain/app/enterprise/entities/room-scheduling'

export class InMemoryRoomSchedulingRepository
  implements RoomSchedulingRepository
{
  public items: RoomScheduling[] = []

  async create(data: RoomScheduling) {
    this.items.push(data)
  }

  async findById(id: string) {
    const roomscheduling = this.items.find((item) => item.id.toString() === id)

    if (!roomscheduling) {
      return null
    }

    return roomscheduling
  }

  async fetchScheduledTimes(
    companyId: string,
    roomId: string,
    startTime: Date,
    endTime: Date,
  ) {
    const roomscheduling = this.items.filter(
      (item) =>
        item.companyId.toString() === companyId &&
        item.roomId.toString() === roomId &&
        ((startTime >= item.startTime && startTime < item.endTime) ||
          (endTime > item.startTime && endTime <= item.endTime) ||
          (startTime <= item.startTime && endTime >= item.endTime)),
    )

    if (roomscheduling.length === 0) {
      return null
    }

    return roomscheduling
  }

  async save(data: RoomScheduling) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === data.id.toString(),
    )

    this.items[itemIndex] = data
  }

  async delete(roomscheduling: RoomScheduling) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === roomscheduling.id.toString(),
    )

    this.items.splice(itemIndex, 1)
  }
}
