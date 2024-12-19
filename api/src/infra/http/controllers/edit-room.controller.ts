import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'

import { AlreadyExistsError } from '@/core/errors/already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UserNotAdminError } from '@/core/errors/user-not-admin'
import { UserNotCompanyError } from '@/core/errors/user-not-company'
import { EditRoomUseCase } from '@/domain/app/application/use-cases/edit-room'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { EditRoomSchemaDto } from './dtos/edit-room.dto'

const editRoomParam = z.object({
  id: z.string().uuid(),
})

type EditRoomParam = z.infer<typeof editRoomParam>

const editRoomSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  active: z.boolean().optional(),
})

type EditRoomSchema = z.infer<typeof editRoomSchema>

@Controller('/rooms/:id')
@ApiTags('rooms')
@ApiBearerAuth()
export class EditRoomController {
  constructor(private editRoomUseCase: EditRoomUseCase) {}

  @Patch()
  @HttpCode(200)
  @ApiOperation({ summary: 'Edit a room.' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: EditRoomSchemaDto })
  @ApiResponse({
    status: 200,
    description: 'Room updated successfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Room name already exists.',
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found - User or room not found.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized - User is not an admin or not part of the company.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
  })
  async handle(
    @Param(new ZodValidationPipe(editRoomParam))
    param: EditRoomParam,
    @Body(new ZodValidationPipe(editRoomSchema)) body: EditRoomSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { id } = param
    const { name, active } = body
    const userId = user.sub

    const result = await this.editRoomUseCase.execute({
      userId,
      roomId: id,
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
        case UserNotCompanyError:
          throw new UnauthorizedException(error.message)
        case AlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
