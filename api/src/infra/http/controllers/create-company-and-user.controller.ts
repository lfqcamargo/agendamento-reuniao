import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { CreateCompanyAndUserUseCase } from '@/domain/users/application/use-cases/create-company-and-user'
import { AlreadyExistsCnpjError } from '@/domain/users/application/use-cases/errors/already-exists-cnpj-error'
import { AlreadyExistsEmailError } from '@/domain/users/application/use-cases/errors/already-exists-email-error'
import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createCompanyAndUserSchema = z.object({
  cnpj: z.string(),
  companyName: z.string(),
  email: z.string(),
  userName: z.string(),
  password: z.string(),
})

type CreateCompanyAndUserSchema = z.infer<typeof createCompanyAndUserSchema>

@Controller('/companies')
@Public()
export class CreateCompanyAndUserController {
  constructor(private useCase: CreateCompanyAndUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createCompanyAndUserSchema))
  async handle(@Body() body: CreateCompanyAndUserSchema) {
    const { cnpj, companyName, email, userName, password } = body

    const result = await this.useCase.execute({
      cnpj,
      companyName,
      email,
      userName,
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
