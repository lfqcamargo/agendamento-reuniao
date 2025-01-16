import { UsersRepository } from '@/domain/users/application/repositories/users-repository'
import { User } from '@/domain/users/enterprise/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(data: User) {
    this.items.push(data)
  }

  async createMany(users: User[]) {
    this.items.push(...users)
  }

  async findById(companyId: string, id: string) {
    const user = this.items.find(
      (item) =>
        item.id.toString() === id && item.companyId.toString() === companyId,
    )

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email.toString() === email)

    if (!user) {
      return null
    }

    return user
  }

  async findByNickname(companyId: string, nickname: string) {
    const user = this.items.find(
      (item) =>
        item.companyId.toString() === companyId &&
        item.nickname.toString() === nickname,
    )

    if (!user) {
      return null
    }

    return user
  }

  async fetchAllAdmins(companyId: string) {
    const users = this.items.filter(
      (item) => item.companyId.toString() === companyId,
    )

    if (users.length === 0) {
      return null
    }

    return users
  }

  async fetchUsersByCompanyId(
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

  async save(data: User) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === data.id.toString(),
    )

    this.items[itemIndex] = data
  }

  async delete(user: User) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === user.id.toString(),
    )

    this.items.splice(itemIndex, 1)
  }
}
