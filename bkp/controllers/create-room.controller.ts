import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'

import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin'
import { CreateRoomUseCase } from '@/domain/app/application/use-cases/create-room'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateRoomSchemaDto } from './dtos/create-room.dto'

const createRoomSchema = z.object({
  name: z.string().min(2).max(50),
  active: z.boolean(),
})

type CreateRoomSchema = z.infer<typeof createRoomSchema>

@Controller('/rooms')
@ApiTags('rooms')
@ApiBearerAuth()
export class CreateRoomController {
  constructor(private createRoomUseCase: CreateRoomUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new room.' })
  @ApiBody({ type: CreateRoomSchemaDto })
  @ApiResponse({
    status: 201,
    description: 'Room created successfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Room name already exists.',
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found - User not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User is not an admin.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  async handle(
    @Body(new ZodValidationPipe(createRoomSchema))
    body: CreateRoomSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, active } = body
    const userId = user.sub

    const result = await this.createRoomUseCase.execute({
      userId,
      name,
      active,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case UserNotAdminError:
          throw new UnauthorizedException(error.message)
        case AlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
