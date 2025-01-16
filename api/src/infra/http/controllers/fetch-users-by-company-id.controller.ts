import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { FetchUsersByCompanyIdUseCase } from '@/domain/users/application/use-cases/fetch-users-by-company-id'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { UserPresenter } from '@/infra/database/prisma/presenters/user-presenter'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FetchUsersByCompanyIdDocs } from './dtos/fetch-users-by-company-id.dto'

const querySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  itemsPerPage: z
    .string()
    .optional()
    .default('20')
    .transform(Number)
    .pipe(z.number().min(1).max(100)),
})

const queryValidationPipe = new ZodValidationPipe(querySchema)

@Controller('/companies/users')
export class FetchUsersByCompanyIdController {
  constructor(
    private fetchUsersByCompanyIdUseCase: FetchUsersByCompanyIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @FetchUsersByCompanyIdDocs()
  async handle(
    @Query(queryValidationPipe) query: { page: number; itemsPerPage: number },
    @CurrentUser() user: UserPayload,
  ) {
    const companyId = user.company

    const { page, itemsPerPage } = query

    const result = await this.fetchUsersByCompanyIdUseCase.execute({
      companyId,
      page,
      itemsPerPage,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { users, meta } = result.value

    return {
      users: users.map(UserPresenter.toHTTP),
      meta,
    }
  }
}
