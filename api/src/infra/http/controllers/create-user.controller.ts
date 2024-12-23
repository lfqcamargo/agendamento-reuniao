import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'
import { CreateUserUseCase } from '@/domain/users/application/use-cases/create-user'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateUserDocs } from './dtos/create-user.dto'
import { roleEnum } from './schemas/role-schema'

const createUserSchema = z.object({
  email: z.string().min(10).max(30),
  name: z.string().min(4).max(50),
  nickname: z.string().min(4).max(20),
  password: z.string().min(6).max(20),
  role: roleEnum,
})

type CreateUserSchema = z.infer<typeof createUserSchema>

@Controller('/users')
export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @CreateUserDocs()
  async handle(
    @Body(new ZodValidationPipe(createUserSchema))
    body: CreateUserSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { company: companyId, sub: userAuthenticateId } = user
    const { email, name, nickname, password, role } = body

    const result = await this.createUserUseCase.execute({
      companyId,
      userAuthenticateId,
      email,
      name,
      nickname,
      password,
      role,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserNotAdminError:
          throw new ForbiddenException(error.message)
        case AlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
