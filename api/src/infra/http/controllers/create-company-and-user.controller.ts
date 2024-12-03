import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

import { CreateCompanyAndUserUseCase } from '@/domain/users/application/use-cases/create-company-and-user'
import { AlreadyExistsCnpjError } from '@/domain/users/application/use-cases/errors/already-exists-cnpj-error'
import { AlreadyExistsEmailError } from '@/domain/users/application/use-cases/errors/already-exists-email-error'
import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateCompanyAndUserSchemaDto } from './dtos/create-company-and-user.dto'

const createCompanyAndUserSchema = z.object({
  cnpj: z.string().length(14),
  companyName: z.string().min(4).max(50),
  email: z.string().min(10).max(30),
  userName: z.string().min(4).max(50),
  nickname: z.string().min(4).max(20),
  password: z.string().min(6).max(20),
})

type CreateCompanyAndUserSchema = z.infer<typeof createCompanyAndUserSchema>

@ApiTags('users')
@Controller('/companies')
@Public()
export class CreateCompanyAndUserController {
  constructor(
    private createCompanyAndUserUseCase: CreateCompanyAndUserUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create the company and register the admin user.' })
  @ApiBody({ type: CreateCompanyAndUserSchemaDto })
  @ApiResponse({
    status: 201,
    description: 'Company and user admin created sucessfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Either the email or the CNPJ already exists.',
    content: {
      'application/json': {
        examples: {
          emailConflict: {
            summary: 'Email already exists',
            value: { message: 'Email already exists.' },
          },
          cnpjConflict: {
            summary: 'CNPJ already exists',
            value: { message: 'CNPJ already exists.' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  @UsePipes(new ZodValidationPipe(createCompanyAndUserSchema))
  async handle(@Body() body: CreateCompanyAndUserSchema) {
    const { cnpj, companyName, email, userName, nickname, password } = body

    const result = await this.createCompanyAndUserUseCase.execute({
      cnpj,
      companyName,
      email,
      name: userName,
      nickname,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case AlreadyExistsCnpjError:
          throw new ConflictException(error.message)
        case AlreadyExistsEmailError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
