import { User } from '@/domain/users/enterprise/entities/user'

export abstract class UserRepository {
  abstract create(user: User): Promise<void>
  abstract findById(id: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
  abstract findByNickname(
    companyId: string,
    nickname: string,
  ): Promise<User | null>
}
