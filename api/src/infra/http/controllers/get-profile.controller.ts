import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { GetProfileUseCase } from '@/domain/users/application/use-cases/get-profile'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { UserPresenter } from '@/infra/database/prisma/presenters/user-presenter'

import { GetProfileDocs } from './dtos/get-profile.dto'

@Controller('/me')
export class GetProfileController {
  constructor(private getProfileUseCase: GetProfileUseCase) {}

  @Get()
  @HttpCode(200)
  @GetProfileDocs()
  async handle(@CurrentUser() user: UserPayload) {
    const { company: companyId, sub: userAuthenticateId } = user

    const result = await this.getProfileUseCase.execute({
      companyId,
      userAuthenticateId,
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
