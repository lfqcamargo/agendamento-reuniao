import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'

import { User, UserRole } from '../../enterprise/entities/user'
import { HashGenerator } from '../cryptography/hash-generator'
import { UsersRepository } from '../repositories/users-repository'

interface CreateUserUseCaseRequest {
  companyId: string
  userAuthenticateId: string
  email: string
  name: string
  nickname: string
  password: string
  role: UserRole
}

type CreateUserUseCaseResponse = Either<
  AlreadyExistsError | ResourceNotFoundError,
  null
>

@Injectable()
export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    companyId,
    userAuthenticateId,
    email,
    name,
    nickname,
    password,
    role,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userAuthenticate = await this.usersRepository.findById(
      companyId,
      userAuthenticateId,
    )

    if (!userAuthenticate) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    if (!userAuthenticate.isAdmin()) {
      return left(new UserNotAdminError())
    }

    const alreadyEmail = await this.usersRepository.findByEmail(email)

    if (alreadyEmail) {
      return left(new AlreadyExistsError('Already exists email.'))
    }

    const alreadynickname = await this.usersRepository.findByNickname(
      companyId,
      nickname,
    )

    if (alreadynickname) {
      return left(new AlreadyExistsError('Already exists email.'))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const newUser = User.create({
      companyId: new UniqueEntityID(companyId),
      email,
      name,
      nickname,
      password: hashedPassword,
      role,
      active: true,
    })

    await this.usersRepository.create(newUser)

    return right(null)
  }
}
