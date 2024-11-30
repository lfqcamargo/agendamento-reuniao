import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SystemDoesNotAllowError } from '@/core/errors/system-does-not-allow'

import { HashGenerator } from '../cryptography/hash-generator'
import { UserRepository } from '../repositories/user-repository'
import { AlreadyExistsNicknameError } from './errors/already-exists-nickname-error'
import { InvalidRoleError } from './errors/invalid-role-error'
import { MissingAdminError } from './errors/missing-admin'

interface EditUserUseCaseRequest {
  userAuthenticateId: string
  id: string
  name?: string
  nickname?: string
  password?: string
  role?: number
  active?: boolean
}

type EditUserUseCaseResponse = Either<
  | ResourceNotFoundError
  | AlreadyExistsNicknameError
  | InvalidRoleError
  | MissingAdminError
  | SystemDoesNotAllowError,
  null
>

@Injectable()
export class EditUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userAuthenticateId,
    id,
    name,
    nickname,
    password,
    role,
    active,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const validRoles = [1, 2] // Admin (1), User (2)

    const userAuthenticate =
      await this.userRepository.findById(userAuthenticateId)

    const user = await this.userRepository.findById(id)

    if (!userAuthenticate) {
      return left(new ResourceNotFoundError('User authenticate not found.'))
    }

    if (!user) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    if (userAuthenticate.companyId.toString() !== user.companyId.toString()) {
      return left(new SystemDoesNotAllowError())
    }

    if (
      userAuthenticate.id.toString() !== user.id.toString() &&
      userAuthenticate.role !== 1
    ) {
      return left(new SystemDoesNotAllowError())
    }

    if (name) {
      user.name = name
    }

    if (nickname) {
      const alreadynickname = await this.userRepository.findByNickname(
        user.companyId.toString(),
        nickname,
      )

      if (alreadynickname) {
        return left(new AlreadyExistsNicknameError())
      }

      user.nickname = nickname
    }

    if (password) {
      const hashedPassword = await this.hashGenerator.hash(password)

      user.password = hashedPassword
    }

    if (role) {
      if (!validRoles.includes(role)) {
        return left(new InvalidRoleError())
      }

      if (user.role === 1) {
        const adminUsers = await this.userRepository.fetchAllAdmins(
          user.companyId.toString(),
        )

        if (!adminUsers || adminUsers.length === 1) {
          return left(new MissingAdminError())
        }
      }

      user.role = role
    }

    if (active) {
      user.active = active
    }

    await this.userRepository.save(user)

    return right(null)
  }
}
