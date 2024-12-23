import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin-error'
import { CreateRoomUseCase } from '@/domain/app/application/use-cases/create-room'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateRoomDocs } from './dtos/create-room.dto'

const createRoomSchema = z.object({
  name: z.string().min(2).max(50),
  active: z.boolean(),
})

type CreateRoomSchema = z.infer<typeof createRoomSchema>

@Controller('/rooms')
export class CreateRoomController {
  constructor(private createRoomUseCase: CreateRoomUseCase) {}

  @Post()
  @HttpCode(201)
  @CreateRoomDocs()
  async handle(
    @Body(new ZodValidationPipe(createRoomSchema))
    body: CreateRoomSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { company: companyId, sub: userId } = user
    const { name, active } = body

    const result = await this.createRoomUseCase.execute({
      companyId,
      userId,
      name,
      active,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
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
