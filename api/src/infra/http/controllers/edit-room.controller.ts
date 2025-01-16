import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'

import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'
import { EditRoomUseCase } from '@/domain/app/application/use-cases/edit-room'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { EditRoomDocs } from './dtos/edit-room.dto'

const editRoomParam = z.object({
  roomId: z.string().uuid(),
})

type EditRoomParam = z.infer<typeof editRoomParam>

const editRoomSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  active: z.boolean().optional(),
})

type EditRoomSchema = z.infer<typeof editRoomSchema>

@Controller('/rooms')
export class EditRoomController {
  constructor(private editRoomUseCase: EditRoomUseCase) {}

  @Patch(':roomId')
  @HttpCode(200)
  @EditRoomDocs()
  async handle(
    @Param(new ZodValidationPipe(editRoomParam))
    param: EditRoomParam,
    @Body(new ZodValidationPipe(editRoomSchema)) body: EditRoomSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { company: companyId, sub: userId } = user

    const { roomId } = param
    const { name, active } = body

    const result = await this.editRoomUseCase.execute({
      companyId,
      userId,
      roomId,
      name,
      active,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new UnauthorizedException(error.message)
        case UserNotAdminError:
          throw new ForbiddenException(error.message)
        case AlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
