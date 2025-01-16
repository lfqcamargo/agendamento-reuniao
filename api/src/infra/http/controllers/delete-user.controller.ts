import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SystemDoesNotAllowError } from '@/core/errors/system-does-not-allow'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'
import { DeleteUserUseCase } from '@/domain/users/application/use-cases/delete-user'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeleteUserDocs } from './dtos/delete-user.dto'

const deleteUserParam = z.object({
  userId: z.string().uuid(),
})

type DeleteUserParam = z.infer<typeof deleteUserParam>

@Controller('/users')
export class DeleteUserController {
  constructor(private deleteUserUseCase: DeleteUserUseCase) {}

  @Delete(':userId')
  @HttpCode(200)
  @DeleteUserDocs()
  async handle(
    @Param(new ZodValidationPipe(deleteUserParam))
    params: DeleteUserParam,
    @CurrentUser() user: UserPayload,
  ) {
    const { company: companyId, sub: userAuthenticateId } = user
    const { userId } = params

    const result = await this.deleteUserUseCase.execute({
      companyId,
      userAuthenticateId,
      userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case UserNotAdminError:
          throw new ForbiddenException(error.message)
        case SystemDoesNotAllowError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
