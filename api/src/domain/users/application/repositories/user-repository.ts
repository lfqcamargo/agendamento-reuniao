import { User } from '@/domain/users/enterprise/entities/user'

export abstract class UserRepository {
  abstract create(user: User): Promise<void>
  abstract findById(id: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
  abstract findByNickname(
    companyId: string,
    nickname: string,
  ): Promise<User | null>

  abstract fetchAllAdmins(companyId: string): Promise<User[] | null>
  abstract fetchUsersByCompanyId(
    companyId: string,
    page: number,
  ): Promise<User[] | null>

  abstract save(user: User): Promise<void>
  abstract delete(user: User): Promise<void>
}
