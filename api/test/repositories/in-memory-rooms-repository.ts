import { RoomsRepository } from '@/domain/app/application/repositories/rooms-repository'
import { Room } from '@/domain/app/enterprise/entities/room'

export class InMemoryRoomsRepository implements RoomsRepository {
  public items: Room[] = []

  async create(data: Room) {
    this.items.push(data)
  }

  async findById(companyId: string, id: string) {
    const room = this.items.find(
      (item) =>
        item.id.toString() === id && item.companyId.toString() === companyId,
    )

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

  async fetchByCompanyId(
    companyId: string,
    page: number,
    itemsPerPage: number = 20,
  ) {
    const filteredUsers = this.items.filter(
      (item) => item.companyId.toString() === companyId,
    )

    const totalItems = filteredUsers.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    const paginatedUsers = filteredUsers.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage,
    )

    const meta = {
      totalItems,
      itemCount: paginatedUsers.length,
      itemsPerPage,
      totalPages,
      currentPage: page,
    }

    return {
      data: paginatedUsers.length > 0 ? paginatedUsers : null,
      meta,
    }
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
