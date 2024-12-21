import { User } from '@/domain/users/enterprise/entities/user'

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      companyId: user.companyId.toString(),
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      role: user.role,
      active: user.active,
      profilePhoto: user.profilePhoto,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    }
  }
}
