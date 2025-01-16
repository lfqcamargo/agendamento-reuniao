import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SystemDoesNotAllowError } from '@/core/errors/system-does-not-allow'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'

import { UserRole } from '../../enterprise/entities/user'
import { HashGenerator } from '../cryptography/hash-generator'
import { UsersRepository } from '../repositories/users-repository'

interface EditUserUseCaseRequest {
  companyId: string
  userAuthenticateId: string
  userId: string
  name?: string
  nickname?: string
  password?: string
  role?: UserRole
  active?: boolean
  profilePhoto?: Buffer | null
}

type EditUserUseCaseResponse = Either<
  | ResourceNotFoundError
  | AlreadyExistsError
  | UserNotAdminError
  | SystemDoesNotAllowError,
  null
>

@Injectable()
export class EditUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    companyId,
    userAuthenticateId,
    userId,
    name,
    nickname,
    password,
    role,
    active,
    profilePhoto,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const userAuthenticate = await this.usersRepository.findById(
      companyId,
      userAuthenticateId,
    )

    const userEdit = await this.usersRepository.findById(companyId, userId)

    if (!userAuthenticate) {
      return left(new ResourceNotFoundError('User authenticate not found.'))
    }

    if (!userEdit) {
      return left(new ResourceNotFoundError('User to edit not found.'))
    }

    if (
      userAuthenticate.role !== UserRole.Admin &&
      userAuthenticate.id.toString() !== userEdit.id.toString()
    ) {
      return left(new UserNotAdminError())
    }

    if (name) {
      userEdit.name = name
    }

    if (nickname) {
      const alreadynickname = await this.usersRepository.findByNickname(
        companyId,
        nickname,
      )

      if (alreadynickname) {
        return left(new AlreadyExistsError('Already exists nickname.'))
      }

      userEdit.nickname = nickname
    }

    if (password) {
      const hashedPassword = await this.hashGenerator.hash(password)

      userEdit.password = hashedPassword
    }

    if (role) {
      if (!userAuthenticate.isAdmin()) {
        return left(
          new SystemDoesNotAllowError('Members cannot change their role'),
        )
      }

      if (userEdit.isAdmin() && role !== UserRole.Admin) {
        const adminUsers = await this.usersRepository.fetchAllAdmins(companyId)

        if (!adminUsers || adminUsers.length === 1) {
          return left(
            new SystemDoesNotAllowError(
              'Must contain at least one administrator.',
            ),
          )
        }
      }

      userEdit.role = role
    }

    if (active !== undefined) {
      if (!userAuthenticate.isAdmin()) {
        return left(
          new SystemDoesNotAllowError('Members cannot switch from inactivity'),
        )
      }
      userEdit.active = active
    }

    if (profilePhoto !== undefined) {
      userEdit.profilePhoto = profilePhoto
    }

    await this.usersRepository.save(userEdit)

    return right(null)
  }
}
