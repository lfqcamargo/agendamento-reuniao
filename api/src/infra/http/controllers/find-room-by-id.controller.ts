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
import { FindRoomByIdUseCase } from '@/domain/app/application/use-cases/find-room-by-id'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { RoomPresenter } from '@/infra/http/presenters/room-presenter'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const roomQueryParamSchema = z.object({ roomId: z.string().uuid() })

type QueryValidationPipe = z.infer<typeof roomQueryParamSchema>

@Controller('/rooms')
export class FindRoomByIdController {
  constructor(private findRoomByIdUseCase: FindRoomByIdUseCase) {}

  @Get(':roomId')
  @HttpCode(200)
  async handle(
    @Param(new ZodValidationPipe(roomQueryParamSchema))
    params: QueryValidationPipe,
    @CurrentUser()
    user: UserPayload,
  ) {
    const { company: companyId, sub: userId } = user

    const { roomId } = params
    const result = await this.findRoomByIdUseCase.execute({
      companyId,
      userId,
      roomId,
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

    return { room: RoomPresenter.toHTTP(result.value.room) }
  }
}
