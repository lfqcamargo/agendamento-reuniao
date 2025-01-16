import { MeetingsRepository } from '@/domain/app/application/repositories/meetings-repository'
import { Meeting } from '@/domain/app/enterprise/entities/meeting'

export class InMemoryMeetingsRepository implements MeetingsRepository {
  public items: Meeting[] = []

  async create(data: Meeting) {
    this.items.push(data)
  }

  async findById(companyId: string, id: string) {
    const meeting = this.items.find(
      (item) =>
        item.companyId.toString() === companyId && item.id.toString() === id,
    )

    if (!meeting) {
      return null
    }

    return meeting
  }

  async fetchScheduledTimes(
    companyId: string,
    roomId: string,
    startTime: Date,
    endTime: Date,
    page: number,
    itemsPerPage: number,
  ) {
    const meeting = this.items.filter(
      (item) =>
        item.companyId.toString() === companyId &&
        item.roomId.toString() === roomId &&
        ((startTime >= item.startTime && startTime < item.endTime) ||
          (endTime > item.startTime && endTime <= item.endTime) ||
          (startTime <= item.startTime && endTime >= item.endTime)),
    )

    if (meeting.length === 0) {
      return null
    }

    const totalItems = meeting.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    const paginatedMeeting = meeting.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage,
    )

    const meta = {
      totalItems,
      itemCount: paginatedMeeting.length,
      itemsPerPage,
      totalPages,
      currentPage: page,
    }

    return {
      data: meeting.length > 0 ? meeting : null,
      meta,
    }
  }

  async save(data: Meeting) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === data.id.toString(),
    )

    this.items[itemIndex] = data
  }

  async delete(meeting: Meeting) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === meeting.id.toString(),
    )

    this.items.splice(itemIndex, 1)
  }

  async deleteByRoomId(companyId: string, roomId: string) {
    const itemIndex = this.items.findIndex(
      (item) =>
        item.companyId.toString() === companyId &&
        item.roomId.toString() === roomId,
    )

    this.items.splice(itemIndex, 1)
  }
}
