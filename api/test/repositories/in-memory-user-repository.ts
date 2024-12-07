import { UserRepository } from '@/domain/users/application/repositories/user-repository'
import { User } from '@/domain/users/enterprise/entities/user'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async create(data: User) {
    this.items.push(data)
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id.toString() === id)

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

  async fetchUsersByCompanyId(companyId: string, page: number) {
    const users = this.items
      .filter((item) => item.companyId.toString() === companyId)
      .slice((page - 1) * 20, page * 20)

    if (users.length === 0) {
      return null
    }

    return users
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
