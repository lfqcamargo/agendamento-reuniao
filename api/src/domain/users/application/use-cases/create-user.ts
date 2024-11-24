import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { User } from '../../enterprise/entities/user'
import { HashGenerator } from '../cryptography/hash-generator'
import { UserRepository } from '../repositories/user-repository'
import { AlreadyExistsEmailError } from './errors/already-exists-email-error'

interface CreateUserUseCaseRequest {
  companyId: string
  email: string
  name: string
  password: string
  role: number
}

type CreateUserUseCaseResponse = Either<AlreadyExistsEmailError, null>

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    companyId,
    email,
    name,
    password,
    role,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const alreadyEmail = await this.userRepository.findByEmail(email)

    if (alreadyEmail) {
      return left(new AlreadyExistsEmailError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      companyId: new UniqueEntityID(companyId),
      email,
      name,
      password: hashedPassword,
      role,
    })

    await this.userRepository.create(user)

    return right(null)
  }
}
