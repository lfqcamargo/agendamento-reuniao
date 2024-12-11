import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { User } from '../../enterprise/entities/user'
import { HashGenerator } from '../cryptography/hash-generator'
import { UserRepository } from '../repositories/user-repository'
import { AlreadyExistsEmailError } from './errors/already-exists-email-error'
import { AlreadyExistsNicknameError } from './errors/already-exists-nickname-error'
import { InvalidRoleError } from './errors/invalid-role-error'

interface CreateUserUseCaseRequest {
  userAuthenticateId: string
  email: string
  name: string
  nickname: string
  password: string
  role: number
}

type CreateUserUseCaseResponse = Either<
  AlreadyExistsEmailError | ResourceNotFoundError | AlreadyExistsNicknameError,
  null
>

@Injectable()
export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userAuthenticateId,
    email,
    name,
    nickname,
    password,
    role,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const validRoles = [1, 2] // Admin (1), User (2)

    if (!validRoles.includes(role)) {
      return left(new InvalidRoleError())
    }

    const userAuthenticate =
      await this.userRepository.findById(userAuthenticateId)

    if (!userAuthenticate) {
      return left(new ResourceNotFoundError('User not found.'))
    }

    const alreadyEmail = await this.userRepository.findByEmail(email)

    if (alreadyEmail) {
      return left(new AlreadyExistsEmailError())
    }

    const alreadynickname = await this.userRepository.findByNickname(
      userAuthenticate.companyId.toString(),
      nickname,
    )

    if (alreadynickname) {
      return left(new AlreadyExistsNicknameError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      companyId: new UniqueEntityID(userAuthenticate.companyId.toString()),
      email,
      name,
      nickname,
      password: hashedPassword,
      role,
      active: true,
    })

    await this.userRepository.create(user)

    return right(null)
  }
}
