import { User } from '@/domain/users/enterprise/entities/user'

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>
  abstract createMany(users: User[]): Promise<void>
  abstract findById(companyId: string, id: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
  abstract findByNickname(
    companyId: string,
    nickname: string,
  ): Promise<User | null>

  abstract fetchAllAdmins(companyId: string): Promise<User[] | null>
  abstract fetchUsersByCompanyId(
    companyId: string,
    page: number,
    itemsPerPage?: number,
  ): Promise<{
    data: User[] | null
    meta: {
      totalItems: number
      itemCount: number
      itemsPerPage: number
      totalPages: number
      currentPage: number
    }
  } | null>

  abstract save(user: User): Promise<void>
  abstract delete(user: User): Promise<void>
}
