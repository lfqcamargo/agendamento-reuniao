import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  Param,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'
import { DeleteRoomUseCase } from '@/domain/app/application/use-cases/delete-room'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeleteRoomDocs } from './dtos/delete-room.dto'

const deleteRoomSchema = z.object({
  roomId: z.string().uuid(),
})

type DeleteRoomSchema = z.infer<typeof deleteRoomSchema>

@Controller('/rooms')
export class DeleteRoomController {
  constructor(private deleteRoomUseCase: DeleteRoomUseCase) {}

  @Delete(':roomId')
  @HttpCode(204)
  @DeleteRoomDocs()
  async handle(
    @Param(new ZodValidationPipe(deleteRoomSchema)) param: DeleteRoomSchema,
    @CurrentUser()
    user: UserPayload,
  ) {
    const { company: companyId, sub: userId } = user
    const { roomId } = param

    const result = await this.deleteRoomUseCase.execute({
      companyId,
      userId,
      roomId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case UserNotAdminError:
          throw new ForbiddenException(error.message)

        default:
          throw new BadRequestException()
      }
    }
  }
}
