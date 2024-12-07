import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'

import { CreateUserUseCase } from '@/domain/users/application/use-cases/create-user'
import { AlreadyExistsEmailError } from '@/domain/users/application/use-cases/errors/already-exists-email-error'
import { InvalidRoleError } from '@/domain/users/application/use-cases/errors/invalid-role-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateUserSchemaDto } from './dtos/create-user.dto'

const createUserSchema = z.object({
  email: z.string().min(10).max(30),
  name: z.string().min(4).max(50),
  nickname: z.string().min(4).max(20),
  password: z.string().min(6).max(20),
  role: z.number(),
})

type CreateUserSchema = z.infer<typeof createUserSchema>

@Controller('/users')
@ApiTags('users')
@ApiBearerAuth()
export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a company user.' })
  @ApiBody({ type: CreateUserSchemaDto })
  @ApiResponse({
    status: 201,
    description: 'User created sucessfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Either the email or the nickname already exists.',
    content: {
      'application/json': {
        examples: {
          emailConflict: {
            summary: 'Email already exists',
            value: { message: 'Email already exists.' },
          },
          cnpjConflict: {
            summary: 'Nickname already exists',
            value: { message: 'Nickname already exists.' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  async handle(
    @Body(new ZodValidationPipe(createUserSchema))
    body: CreateUserSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { email, name, nickname, password, role } = body
    const userAuthenticateId = user.sub

    const result = await this.createUserUseCase.execute({
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
        case AlreadyExistsEmailError:
          throw new ConflictException(error.message)
        case InvalidRoleError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
