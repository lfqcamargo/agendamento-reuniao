import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { cnpj } from 'cpf-cnpj-validator'
import { z } from 'zod'

import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { CreateCompanyAndUserUseCase } from '@/domain/users/application/use-cases/create-company-and-user'
import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateCompanyAndUserDocs } from './dtos/create-company-and-user.dto'

const createCompanyAndUserSchema = z.object({
  cnpj: z
    .string()
    .length(14)
    .refine((value) => cnpj.isValid(value), { message: 'Invalid CNPJ.' }),
  companyName: z.string().min(4).max(50),
  email: z.string().min(10).max(30),
  userName: z.string().min(4).max(50),
  nickname: z.string().min(4).max(20),
  password: z.string().min(6).max(20),
})

type CreateCompanyAndUserSchema = z.infer<typeof createCompanyAndUserSchema>

@Controller('/companies')
@Public()
export class CreateCompanyAndUserController {
  constructor(
    private createCompanyAndUserUseCase: CreateCompanyAndUserUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @CreateCompanyAndUserDocs()
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
        case AlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
