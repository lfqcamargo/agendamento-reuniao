import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { FindUserByIdUseCase } from '@/domain/users/application/use-cases/find-user-by-id'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { UserPresenter } from '@/infra/database/prisma/presenters/user-presenter'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FindUserByIdDocs } from './dtos/find-user-by-id.dto'

const findUserByIdParam = z.object({
  userId: z.string().uuid(),
})

type FindUserByIdParam = z.infer<typeof findUserByIdParam>

@Controller('/users')
export class FindUserByIdController {
  constructor(private findUserByIdUseCase: FindUserByIdUseCase) {}

  @Get(':userId')
  @HttpCode(200)
  @FindUserByIdDocs()
  async handle(
    @Param(new ZodValidationPipe(findUserByIdParam))
    params: FindUserByIdParam,
    @CurrentUser() user: UserPayload,
  ) {
    const companyId = user.company
    const { userId } = params

    const result = await this.findUserByIdUseCase.execute({
      companyId,
      userId,
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

    return { user: UserPresenter.toHTTP(result.value.user) }
  }
}
